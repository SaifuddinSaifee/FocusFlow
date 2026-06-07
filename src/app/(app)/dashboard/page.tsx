import { createClient } from "@/lib/supabase/server";
import { getProjectsWithStats } from "@/lib/supabase/queries/projects";
import { getTodayTasks, getPrioritySummary } from "@/lib/supabase/queries/tasks";
import { getProfile } from "@/lib/supabase/queries/profiles";
import { TodayPanel } from "@/components/dashboard/TodayPanel";
import { ProgressRingsGrid } from "@/components/dashboard/ProgressRingsGrid";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { CourseProgressList } from "@/components/dashboard/CourseProgressList";
import { PrioritySummary } from "@/components/dashboard/PrioritySummary";

export const metadata = { title: "Dashboard — FocusFlow" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [todayTasks, projects, prioritySummary, profile] =
    await Promise.all([
      getTodayTasks(supabase, user.id).catch(() => []),
      getProjectsWithStats(supabase, user.id).catch(() => []),
      getPrioritySummary(supabase, user.id).catch(() => ({ high: 0, medium: 0, low: 0 })),
      getProfile(supabase, user.id).catch(() => null),
    ]);

  const activeProjects = projects.filter((p) => p.status !== "Done");
  const courses = activeProjects.filter((p) => p.is_course);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">
          Good {getGreeting()}, {profile?.display_name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-sm text-base-content/60 mt-0.5">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Today + Priority */}
        <div className="flex flex-col gap-6">
          <TodayPanel tasks={todayTasks} />
          <PrioritySummary summary={prioritySummary} />
          {profile && <StreakCard profile={profile} />}
        </div>

        {/* Center column — Progress rings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {activeProjects.length > 0 && (
            <ProgressRingsGrid projects={activeProjects} />
          )}
          {courses.length > 0 && (
            <CourseProgressList courses={courses} />
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
