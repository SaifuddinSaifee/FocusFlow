# FocusFlow — Product Requirements Document
### MVP v1.0

---

## 1. Overview

**Product Name:** FocusFlow
**Tagline:** *Plan it. Focus. Finish it.*

FocusFlow is a web app for students and self-learners who want one place to plan their work, track progress, consume course content, take notes, and stay focused — without jumping between tools.

**Design System:** DaisyUI (Tailwind CSS)
**Target Users:** Students, self-learners, and productivity-focused individuals

---

## 2. Problem Statement

Learners juggle tasks, courses, deadlines, notes, and focus sessions across multiple disconnected apps. There is no single tool that unifies all of these in a clean, friction-free experience.

---

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Users complete tasks consistently | ≥ 60% of created tasks marked done within deadline |
| Users engage with course content in-app | ≥ 3 video sessions per active user per week |
| Focus timer is used regularly | ≥ 5 Pomodoro sessions per active user per week |
| Retention | ≥ 40% of users return after 7 days |

---

## 4. Terminology

Simple, familiar words throughout the app — no jargon.

| Term | Meaning |
|---|---|
| **Project** | The core unit of work. Can be a task, a goal, or a course. |
| **Course** | A Project flagged as learning content, with YouTube videos attached. |
| **Chapter / Module** | A sub-unit inside a Course (maps to a video or a section of the playlist). |
| **Task** | A to-do item inside a Project, or a standalone to-do. |
| **Note** | A Markdown document. Can be standalone or attached to a Project, Chapter, or Task. |
| **Focus Session** | A Pomodoro timer session, optionally linked to a Project or Task. |
| **Streak** | Consecutive days where at least one Focus Session was completed. |

---

## 5. Features

### 5.1 Authentication & Session Management

- Email/password sign-up and login
- Google OAuth sign-in
- Secure session management (JWT + HTTP-only cookies, 30-day refresh)
- Password reset via email

---

### 5.2 Dashboard

The home screen after login. One view to understand everything at a glance.

**Sections:**
- **Today** — Tasks and Projects due today or overdue; one-click to start a Focus Session
- **Progress** — Completion rings per active Project
- **Streak** — Current streak, longest streak, and a calendar heatmap of daily activity
- **Activity Graph** — Bar chart of tasks completed and focus time over the last 7 / 30 days
- **Course Progress** — Video completion percentage per active Course
- **Priority Summary** — Count of High / Medium / Low priority items currently open

---

### 5.3 Projects

A Project is the top-level container for work. Every task, note, and session can live inside a Project.

#### Creating a Project

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Deadline | Yes | Date picker |
| Description | No | Plain text summary |
| Priority | Yes | High / Medium / Low |
| Is this a course? | Yes | Toggle — reveals Course fields |

#### If "This is a course" is on:

| Field | Required | Notes |
|---|---|---|
| YouTube Link | Yes | A single video URL or a playlist URL |
| Auto-fetched | — | Thumbnail, title, video count pulled via YouTube Data API |

#### Project Views
- **List View** — All Projects, sorted by deadline; filterable by status and priority
- **Board View** — Kanban columns: To Do / In Progress / Done
- **Project Detail Page** — Full view with tasks, notes, video player (if Course), and Focus Session launcher

#### Project Status
Projects move through: **To Do → In Progress → Done**
Status updates manually or auto-updates based on task completion percentage.

---

### 5.4 Tasks

Tasks are actionable to-do items. They can exist in two ways:

1. **Inside a Project** — tied to a specific Project (or Chapter within a Course)
2. **Standalone** — independent tasks not part of any Project, accessible from a global Tasks view

#### Task Fields

| Field | Required | Notes |
|---|---|---|
| Title | Yes | |
| Deadline | No | |
| Priority | Yes | High / Medium / Low |
| Status | Yes | To Do / In Progress / Done |
| Attached Note | No | A Note can be linked to this specific task |
| Project | No | Assign to a Project (or leave standalone) |

---

### 5.5 Courses (Learning Projects)

When a Project is flagged as a Course:

- The YouTube video or playlist is embedded directly inside the Project Detail page via the YouTube IFrame API — streamed in-app, no downloads
- For playlists, a sidebar lists all videos (Chapters); each is checked off when watched
- Progress bar = (videos watched ÷ total videos) × 100
- Watching a video auto-marks it as complete and updates the Project's progress
- Each Chapter can have its own attached Note (e.g., lecture notes for that video)
- Course progress syncs to the Dashboard

> YouTube videos are embedded and streamed (not downloaded), in line with YouTube's Terms of Service.

---

### 5.6 Notes

Notes in FocusFlow are full Markdown documents. They can be standalone or attached to any piece of content.

#### Two types of Notes:

**1. Standalone Notes**
- Created independently from the Notes section in the sidebar
- Work like personal Notion pages — free-form Markdown documents
- Organized by title and last-edited date
- Searchable across all notes

**2. Attached Notes**
Notes can be attached to any of the following:

| Attach to | Example use case |
|---|---|
| A Project | Overall project notes, references, goals |
| A Task | Context, research, or drafts for a specific task |
| A Chapter (in a Course) | Lecture notes for a specific video |

Attached notes are accessible directly from the Project, Task, or Chapter they belong to — no hunting required.

#### Markdown Editor
- Full Markdown support: headings, bold, italic, strikethrough, inline code, code blocks (with language syntax highlighting), blockquotes, ordered and unordered lists, tables, horizontal rules, links, and images (via URL)
- Split-pane view: Markdown source on the left, live rendered preview on the right
- Toggle to full-screen writing mode
- **Export options:** Download as `.md` file or rendered `.pdf`
- Auto-save every 30 seconds; last-saved timestamp shown

---

### 5.7 Focus Timer (Pomodoro)

Accessible from the top nav bar or from any Project / Task detail page.

**Timer Modes:**
- Focus: 25 min (default)
- Short Break: 5 min
- Long Break: 15 min (after every 4 Focus sessions)

**Behavior:**
- Optionally link the session to a Project or Task at the start
- Browser tab shows live countdown: `🍅 18:32 — FocusFlow`
- Desktop notification when session ends (with browser permission)
- Completed sessions are logged and attributed to the linked Project/Task
- Session count shown on each Project card (e.g., "8 focus sessions")

**Settings:**
- Custom durations for each mode
- Auto-start breaks toggle
- Timer end sound on/off

---

### 5.8 Priority System

Every Project and Task has a priority level:

- 🔴 **High** — Shown first, highlighted in red
- 🟡 **Medium** — Default
- 🟢 **Low** — Background work

Priority is filterable on all list views and surfaced on the Dashboard.

---

## 6. Navigation Structure

```
FocusFlow
├── Dashboard
├── Projects
│   ├── All Projects (List / Board)
│   └── Project Detail
│       ├── Overview (name, deadline, priority, description)
│       ├── Tasks
│       ├── Notes (attached to project)
│       ├── Chapters + Video Player  [Courses only]
│       │   └── Chapter Note
│       └── Focus Sessions
├── Tasks (standalone view)
├── Notes (all standalone notes)
├── Focus Timer (global, always accessible)
└── Settings
    ├── Profile
    ├── Timer Preferences
    └── Account
```

---

## 7. Technical Stack (Recommended)

| Layer | Choice |
|---|---|
| Frontend | React (Vite) + DaisyUI + Tailwind CSS |
| Backend | Node.js + Express or Next.js (full-stack) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Video | YouTube IFrame API + YouTube Data API v3 |
| Markdown Editor | CodeMirror or Monaco + `marked` / `remark` for rendering |
| Syntax Highlighting | highlight.js or Prism |
| PDF Export | `jsPDF` + `html2canvas` or server-side Puppeteer |
| Charts | Recharts |
| ORM | Prisma |
| Hosting | Vercel |

---

## 8. Data Models (Simplified)

**User** — id, email, passwordHash, createdAt, currentStreak, longestStreak

**Project** — id, userId, name, description, deadline, priority, status, isCourse, youtubeLink, createdAt, updatedAt

**Chapter** — id, projectId, youtubeVideoId, title, thumbnail, position, isWatched

**Task** — id, userId, projectId (nullable), chapterId (nullable), title, deadline, priority, status, createdAt

**Note** — id, userId, title, body (Markdown), projectId (nullable), taskId (nullable), chapterId (nullable), createdAt, updatedAt

**FocusSession** — id, userId, projectId (nullable), taskId (nullable), durationMinutes, completedAt

---

## 9. Out of Scope for MVP

- Plan sharing, rating, and Explore page
- Calendar integrations
- Study Rooms
- Mobile native apps
- Offline mode
- AI-generated study plans
- Real-time collaboration on Notes

---

## 10. Future Scope

| Feature | Description |
|---|---|
| **Shared Plans** | Publish a Project template with tasks, resources, and schedule for others to clone |
| **Explore Page** | Discover community-shared plans; filter by topic, rating, and duration |
| **Plan Ratings** | Rate and review shared plans |
| **Calendar Sync** | Sync Project deadlines and Focus Sessions to Google / Apple Calendar |
| **Study Rooms** | Real-time virtual rooms with shared timers and presence for group focus sessions |
| **Note Collaboration** | Share a Note with another user for real-time co-editing |

---

## 11. Design Principles

- **Familiar words** — Project, Task, Note. No invented jargon.
- **Everything in one place** — Watch a video, take notes, run a timer, check off tasks — all in the same screen
- **Progress is always visible** — Users always know how far along they are on every Project
- **Markdown-first notes** — Powerful but simple; no block editors, no drag-and-drop complexity
- **Mobile-responsive** — Fully usable on phone browsers
- **DaisyUI theming** — Light and dark mode; clean, modern UI out of the box

---

## 12. MVP Milestones

| Milestone | Deliverables |
|---|---|
| M1 — Foundation | Auth, DB schema, session management, basic routing |
| M2 — Projects & Tasks | Create/edit/delete Projects and Tasks, priority, status, kanban board |
| M3 — Courses | YouTube embed, playlist parsing, Chapter tracking, video progress |
| M4 — Notes | Standalone notes, attached notes, Markdown editor, export (.md, .pdf) |
| M5 — Focus Timer | Pomodoro timer, session logging, Project/Task linking |
| M6 — Dashboard | Progress rings, streak tracker, activity graph, course progress widget |
| M7 — Polish | DaisyUI theming, dark mode, responsive layout, browser notifications |

---

*Document version: 2.0 — MVP scope only*
