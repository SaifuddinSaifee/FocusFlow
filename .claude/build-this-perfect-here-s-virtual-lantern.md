# FocusFlow — Full Build Plan

## Context

FocusFlow is a productivity web app for students and self-learners. The project directory (`d:\Saifuddin\Projects\FocusFlow`) is currently empty — only the PRD exists. This plan covers building the entire app from scratch following the 7 milestones in the PRD, using the solo-dev stack: Next.js App Router + Supabase + DaisyUI + Zustand.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript, src dir) |
| Database + Auth | Supabase (PostgreSQL + email/password + Google OAuth) |
| UI | DaisyUI + Tailwind CSS |
| Client State | Zustand (with persist middleware for settings/timer) |
| Markdown Editor | `@uiw/react-md-editor` (dynamic import, ssr: false) |
| PDF Export | `jsPDF` + `html2canvas` |
| Charts | Recharts |
| Date utils | date-fns |
| Validation | Zod (on server actions) |
| Hosting | Vercel |

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── (auth)/                       # Centered layout, no sidebar
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (app)/                        # Protected shell with sidebar
│   │   ├── layout.tsx                # Sidebar + TopNav + TimerModal
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx              # List/Board toggle
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx         # Tabbed detail page
│   │   ├── tasks/page.tsx            # Standalone tasks
│   │   ├── notes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx         # Note editor
│   │   └── settings/
│   │       ├── profile/page.tsx
│   │       ├── timer/page.tsx
│   │       └── account/page.tsx
│   └── api/
│       ├── auth/callback/route.ts    # Supabase OAuth code exchange
│       └── youtube/
│           ├── playlist/route.ts     # YouTube Data API (server-side, keyed)
│           └── video/route.ts
├── components/
│   ├── ui/                           # ProgressRing, Badge, Modal, Skeleton, EmptyState
│   ├── layout/                       # Sidebar, TopNav, TimerPill, ThemeToggle
│   ├── auth/                         # LoginForm, SignupForm, GoogleOAuthButton
│   ├── dashboard/                    # TodayPanel, ProgressRingsGrid, StreakCard, ActivityGraph, ...
│   ├── projects/                     # ProjectCard, ProjectListView, ProjectBoardView, KanbanColumn, ProjectForm
│   ├── tasks/                        # TaskItem, TaskList, TaskForm, TaskKanban, TaskFilters
│   ├── notes/                        # NoteCard, NoteEditor, NoteExportMenu
│   ├── courses/                      # YouTubePlayer, ChapterList, ChapterItem, CourseProgressBar, PlaylistImport
│   ├── timer/                        # TimerDisplay, TimerModal, TimerLinkSelector, SessionLog
│   └── providers/                    # SupabaseProvider, AuthProvider, TimerProvider
├── stores/
│   ├── authStore.ts                  # user, profile
│   ├── timerStore.ts                 # mode, status, secondsRemaining, linkedProject/Task
│   ├── uiStore.ts                    # sidebarCollapsed, projectViewMode, timerModalOpen
│   └── settingsStore.ts              # theme, timer durations — persisted to localStorage
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient()
│   │   ├── server.ts                 # createServerClient(cookies())
│   │   └── queries/                  # projects.ts, tasks.ts, notes.ts, chapters.ts, sessions.ts, profiles.ts
│   ├── youtube/
│   │   ├── api.ts                    # YouTube Data API fetch helpers
│   │   └── parseUrl.ts               # Extract videoId/playlistId from any YT URL form
│   ├── pdf/exportNote.ts             # html2canvas + jsPDF, scale:2, multi-page splitting
│   ├── streak/calculate.ts           # Streak logic (consecutive-day calculation)
│   └── utils/                        # formatDate, priorityColor, cn (clsx + tailwind-merge)
├── actions/                          # Server Actions (Zod-validated)
│   ├── auth.ts                       # signUp, signIn, signOut, resetPassword
│   ├── projects.ts                   # createProject, updateProject, deleteProject
│   ├── tasks.ts                      # createTask, updateTask, deleteTask, updateStatus
│   ├── notes.ts                      # createNote, updateNote, deleteNote
│   ├── chapters.ts                   # markChapterWatched
│   ├── sessions.ts                   # logFocusSession (also updates streak)
│   └── profiles.ts                   # updateProfile
├── hooks/                            # useUser, useTimer, useDebounce, useYouTubePlayer
├── types/
│   ├── database.types.ts             # Supabase CLI generated
│   └── app.types.ts                  # Derived app types
└── middleware.ts                     # Auth guard + session refresh (using @supabase/ssr)
```

---

## Supabase SQL Schema

Run this in Supabase SQL editor after creating the project:

### Tables

```sql
-- ENUMS
create type priority_level as enum ('High', 'Medium', 'Low');
create type project_status as enum ('ToDo', 'InProgress', 'Done');
create type task_status as enum ('ToDo', 'InProgress', 'Done');

-- PROFILES (extends auth.users)
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  display_name    text,
  avatar_url      text,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  last_active_date date,
  created_at      timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PROJECTS
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  description     text,
  deadline        date not null,
  priority        priority_level not null default 'Medium',
  status          project_status not null default 'ToDo',
  is_course       boolean not null default false,
  youtube_link    text,
  playlist_id     text,
  video_id        text,
  thumbnail_url   text,
  total_chapters  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_projects_user_id on public.projects(user_id);

-- CHAPTERS
create table public.chapters (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references public.projects(id) on delete cascade,
  youtube_video_id text not null,
  title            text not null,
  thumbnail        text,
  duration_seconds integer,
  position         integer not null default 0,
  is_watched       boolean not null default false,
  watched_at       timestamptz,
  created_at       timestamptz not null default now()
);
create index idx_chapters_project_id on public.chapters(project_id);

-- TASKS
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  chapter_id  uuid references public.chapters(id) on delete set null,
  title       text not null,
  deadline    date,
  priority    priority_level not null default 'Medium',
  status      task_status not null default 'ToDo',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_project_id on public.tasks(project_id);

-- NOTES
create table public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled Note',
  body        text not null default '',
  project_id  uuid references public.projects(id) on delete set null,
  task_id     uuid references public.tasks(id) on delete set null,
  chapter_id  uuid references public.chapters(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  fts tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))
  ) stored
);
create index idx_notes_user_id on public.notes(user_id);
create index idx_notes_fts on public.notes using gin(fts);

-- FOCUS SESSIONS
create table public.focus_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  project_id       uuid references public.projects(id) on delete set null,
  task_id          uuid references public.tasks(id) on delete set null,
  duration_minutes integer not null,
  completed_at     timestamptz not null default now()
);
create index idx_focus_sessions_user_id on public.focus_sessions(user_id);
create index idx_focus_sessions_completed_at on public.focus_sessions(user_id, completed_at);

-- UPDATED_AT trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger set_updated_at_projects before update on public.projects for each row execute procedure public.set_updated_at();
create trigger set_updated_at_tasks    before update on public.tasks    for each row execute procedure public.set_updated_at();
create trigger set_updated_at_notes    before update on public.notes    for each row execute procedure public.set_updated_at();

-- ACTIVITY GRAPH function (used by Dashboard)
create or replace function public.get_activity_graph(p_user_id uuid, p_days integer)
returns table(day date, tasks_completed integer, focus_minutes integer) as $$
  select d.day::date,
    coalesce(t.cnt, 0)::integer,
    coalesce(f.minutes, 0)::integer
  from generate_series(current_date - (p_days-1)*interval'1 day', current_date, '1 day') as d(day)
  left join (
    select date_trunc('day', updated_at)::date as day, count(*)::integer as cnt
    from tasks where user_id=p_user_id and status='Done'
      and updated_at >= current_date-(p_days-1)*interval'1 day'
    group by 1
  ) t on t.day=d.day::date
  left join (
    select date_trunc('day', completed_at)::date as day, sum(duration_minutes)::integer as minutes
    from focus_sessions where user_id=p_user_id
      and completed_at >= current_date-(p_days-1)*interval'1 day'
    group by 1
  ) f on f.day=d.day::date
  order by d.day;
$$ language sql stable;
```

### RLS Policies

```sql
alter table public.profiles       enable row level security;
alter table public.projects       enable row level security;
alter table public.chapters       enable row level security;
alter table public.tasks          enable row level security;
alter table public.notes          enable row level security;
alter table public.focus_sessions enable row level security;

create policy "own profile"   on public.profiles       for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "own projects"  on public.projects       for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own chapters"  on public.chapters       for all
  using  (exists (select 1 from projects p where p.id=project_id and p.user_id=auth.uid()))
  with check (exists (select 1 from projects p where p.id=project_id and p.user_id=auth.uid()));
create policy "own tasks"     on public.tasks          for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own notes"     on public.notes          for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own sessions"  on public.focus_sessions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
```

---

## Zustand Stores

**`timerStore.ts`** — most critical. Holds `mode`, `status`, `secondsRemaining`, `completedPomodoros`, `linkedProjectId`, `linkedTaskId`. The `setInterval` lives in `TimerProvider` (a React component in the app layout), NOT in the store. Store only holds state; provider owns the interval lifecycle and calls `store.tick()` every second. Provider also syncs `document.title` on each tick.

**`settingsStore.ts`** — `persist` middleware to localStorage. Holds timer durations, `autoStartBreaks`, `soundEnabled`, `theme`.

**`authStore.ts`** — `user` (Supabase User) + `profile` (profiles row). Populated by `AuthProvider` listening to `onAuthStateChange`.

**`uiStore.ts`** — `sidebarCollapsed`, `projectViewMode` ('list'|'board'), `activeTimerModalOpen`.

---

## Milestones

### M1 — Foundation
1. `npx create-next-app@latest focusflow --typescript --tailwind --app --src-dir --import-alias "@/*"`
2. Install packages: `@supabase/ssr @supabase/supabase-js daisyui zustand clsx tailwind-merge date-fns zod @uiw/react-md-editor jspdf html2canvas recharts @hello-pangea/dnd`
3. Configure `tailwind.config.ts`: add DaisyUI plugin, list themes (light, dark, cupcake, forest, etc.)
4. Create Supabase project → run schema SQL above
5. `lib/supabase/client.ts` + `lib/supabase/server.ts`
6. `middleware.ts` — auth guard using `@supabase/ssr`, redirect unauthenticated to `/login`
7. `(auth)` route group: login, signup, reset-password pages with forms
8. `api/auth/callback/route.ts` — `supabase.auth.exchangeCodeForSession(code)` → redirect to `/dashboard`
9. `SupabaseProvider`, `AuthProvider`, `authStore.ts`
10. `(app)/layout.tsx` shell — sidebar stub + topnav stub
11. Generate types: `npx supabase gen types typescript --project-id <id> > src/types/database.types.ts`

### M2 — Projects & Tasks
1. `lib/supabase/queries/projects.ts` and `queries/tasks.ts` (typed query helpers)
2. `actions/projects.ts` + `actions/tasks.ts` (Zod-validated server actions, `revalidatePath` after mutations)
3. `ProjectForm.tsx` — handles create/edit, shows YouTube fields when `isCourse` toggle is on
4. `ProjectListView.tsx`, `ProjectBoardView.tsx`, `ProjectCard.tsx`
5. `KanbanColumn.tsx`, `TaskItem.tsx`, `TaskForm.tsx` modal
6. `/projects/page.tsx` — fetches server-side, passes to client view components
7. `/projects/[id]/page.tsx` — tabbed detail (Overview, Tasks, Notes, Chapters, Sessions)
8. `/tasks/page.tsx` — standalone tasks with filter bar

Note: Skip drag-and-drop for now. Status changes via click/dropdown. Add `@hello-pangea/dnd` in M7 polish.

Auto-status: In `updateTask` server action, after marking all tasks Done, call a helper that checks task completion % and updates project status accordingly.

### M3 — Courses
1. `lib/youtube/parseUrl.ts` — handles all YT URL forms, returns `{ type, videoId?, playlistId? }`
2. `api/youtube/playlist/route.ts` — server-side call to YouTube Data API v3, handles pagination (`nextPageToken` loop), returns normalized chapters array
3. `api/youtube/video/route.ts` — single video metadata
4. Update `ProjectForm.tsx` to call `/api/youtube/playlist` on URL input for preview
5. `createProject` server action creates chapters rows in a batch insert after fetching playlist
6. `YouTubePlayer.tsx` — load IFrame API via `next/script strategy="afterInteractive"` in app layout; use `window.onYouTubeIframeAPIReady` guard; fire `markChapterWatched` on `YT.PlayerState.ENDED`
7. `ChapterList.tsx` + `ChapterItem.tsx`, `CourseProgressBar.tsx`
8. Chapters tab in Project Detail
9. `actions/chapters.ts` — `markChapterWatched` updates `is_watched`, `watched_at`, recalculates `projects.total_chapters`

### M4 — Notes
1. `lib/supabase/queries/notes.ts` + `actions/notes.ts`
2. `NoteEditor.tsx` — `dynamic(() => import('@uiw/react-md-editor'), { ssr: false })` (mandatory — crashes without)
3. Auto-save: `useDebounce(body, 2000)` → `updateNote` server action when debounced value changes; show "Saved X seconds ago" timestamp
4. `NoteExportMenu.tsx` — `.md` export via `Blob` + anchor click; `.pdf` via `lib/pdf/exportNote.ts`
5. `exportNote.ts` — `html2canvas` on the rendered preview div (`scale: 2`), split canvas at page height, `jsPDF.addPage()` for multi-page notes
6. `NoteList.tsx`, `NoteCard.tsx`
7. `/notes/page.tsx` (list with search using Supabase `textSearch('fts', query)`) and `/notes/[id]/page.tsx`
8. Note attachment UI in Project detail notes tab and Task form

MDEditor dark mode: pass `data-color-mode` prop based on current DaisyUI theme (`document.documentElement.getAttribute('data-theme')`).

### M5 — Focus Timer
1. `settingsStore.ts` with Zustand persist
2. `timerStore.ts` — state only, no intervals
3. `TimerProvider.tsx` — `useEffect` setInterval when `status === 'running'`; calls `store.tick()`; syncs `document.title` (`⏱ MM:SS — FocusFlow`); plays sound on complete; fires browser notification
4. `TimerDisplay.tsx` — mode tabs, MM:SS countdown, pomodoro dots, control buttons
5. `TimerLinkSelector.tsx` — project dropdown, task dropdown filtered by project
6. `TimerModal.tsx` + `TimerPill.tsx` in TopNav
7. `actions/sessions.ts` — `logFocusSession` inserts row + calls streak update logic from `lib/streak/calculate.ts`
8. `SessionLog.tsx` for Project Detail sessions tab
9. `/settings/timer/page.tsx`

Browser notifications: call `Notification.requestPermission()` on first "Start" click, never on mount. Sound: pre-create `Audio` object, `.play()` on complete (Web Audio API unlock via first user interaction).

### M6 — Dashboard
1. Install recharts (already in package list)
2. Dashboard data queries — all fetched in parallel in `/dashboard/page.tsx` (Server Component) via `Promise.all`:
   - today's tasks and overdue projects
   - per-project completion percentages
   - streak data from profiles
   - activity graph via `supabase.rpc('get_activity_graph', { p_user_id, p_days: 30 })`
   - course progress per active course
   - priority summary counts
3. `TodayPanel.tsx`, `ProgressRingsGrid.tsx`, `StreakCard.tsx` (custom SVG heatmap grid), `ActivityGraph.tsx` (Recharts BarChart), `CourseProgressList.tsx`, `PrioritySummary.tsx`
4. `ProgressRing.tsx` — SVG circle with `stroke-dashoffset` for % fill
5. Compose `/dashboard/page.tsx` — pass server-fetched data as props to client chart components

### M7 — Polish
1. DaisyUI theme switcher in Settings (5-6 themes) — `settingsStore.setTheme` → `document.documentElement.setAttribute('data-theme', theme)`
2. Dark mode audit — ensure MDEditor, charts, custom SVGs all respect current theme
3. Responsive layout — sidebar drawer on mobile (DaisyUI `drawer` component)
4. Loading skeletons (`Skeleton.tsx`) for all async data sections
5. Empty states (`EmptyState.tsx`) for no projects, no tasks, no notes
6. Error boundaries around major sections
7. Zod validation audit on all server actions
8. Keyboard shortcuts: `Escape` closes modals, `Ctrl+S` saves note
9. Browser notification flow completion

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Server-only (no NEXT_PUBLIC_ prefix):
YOUTUBE_API_KEY=your-youtube-data-api-v3-key
```

YouTube API key is never exposed to the client — all YouTube Data API calls go through `/api/youtube/*` routes.

---

## Critical Gotchas

| Area | Issue | Fix |
|---|---|---|
| Supabase SSR | `@supabase/supabase-js` in Server Components breaks auth | Always use `@supabase/ssr` `createServerClient` in server contexts |
| MDEditor | Crashes on SSR (`window` access) | `dynamic(() => import(...), { ssr: false })` — not optional |
| YouTube IFrame | Global script, not npm | Load via `next/script strategy="afterInteractive"` in app layout |
| Timer interval | `setInterval` in Zustand doesn't survive navigation | Interval lives in `TimerProvider` React component, not the store |
| Tab title | Next.js metadata overwrites `document.title` | Directly mutate in TimerProvider's interval callback |
| Streak timezone | UTC midnight can split user's "same day" | Use local date for comparison; store UTC for now, add timezone in v2 |
| PDF multi-page | Long notes get cut off at page boundary | Split canvas at page height in `exportNote.ts`, use `jsPDF.addPage()` |
| YouTube quota | Re-fetching playlists burns 10k/day quota | Import playlist once to DB; never re-fetch unless explicit "Refresh" button |
| OAuth callback | Google OAuth fails silently without callback route | `api/auth/callback/route.ts` must exist and call `exchangeCodeForSession` |
| Chapters RLS | No `user_id` on chapters table | RLS subquery joins through `projects` table |

---

## Verification Plan

After each milestone:
- **M1**: Can sign up, log in with email, log in with Google, see protected `/dashboard` route, get redirected to `/login` when logged out
- **M2**: Can create/edit/delete projects and tasks, switch list/board view, change status, filter by priority
- **M3**: Paste a YouTube playlist URL → chapters auto-populate → video embeds and plays → marking watched updates progress bar
- **M4**: Create a note, write Markdown, see live preview, auto-save fires after 2s idle, download `.md` file, export PDF with correct formatting
- **M5**: Start timer → tab title updates → completing a session logs it → streak increments → project card shows session count
- **M6**: Dashboard shows today's items, progress rings update when tasks complete, activity graph shows last 30 days, streak heatmap renders
- **M7**: Theme switch applies instantly everywhere including MDEditor; sidebar collapses to drawer on mobile; skeleton loaders show on slow connections

Run `npm run build` before each milestone completion — TypeScript errors surface before deployment.
