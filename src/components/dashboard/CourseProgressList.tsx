import Link from "next/link";
import type { ProjectWithStats } from "@/types/app.types";

interface CourseProgressListProps {
  courses: ProjectWithStats[];
}

export function CourseProgressList({ courses }: CourseProgressListProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <h2 className="font-semibold text-base-content mb-3">Course Progress</h2>
        <div className="flex flex-col gap-3">
          {courses.slice(0, 5).map((course) => {
            const pct =
              course.total_chapters > 0
                ? Math.round((course.watched_chapters / course.total_chapters) * 100)
                : 0;

            return (
              <Link key={course.id} href={`/projects/${course.id}?tab=chapters`}>
                <div className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-base-200 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{course.name}</p>
                    <span className="text-xs text-base-content/50 flex-shrink-0 ml-2">
                      {course.watched_chapters}/{course.total_chapters} videos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-base-300 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-base-content/50 w-8 text-right">{pct}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
