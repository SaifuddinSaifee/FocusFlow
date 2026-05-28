import type { Profile } from "@/types/app.types";

interface StreakCardProps {
  profile: Profile;
}

export function StreakCard({ profile }: StreakCardProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <h2 className="font-semibold text-base-content mb-3">Streak</h2>
        <div className="flex gap-4">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-primary">{profile.current_streak}</div>
            <div className="text-xs text-base-content/50 mt-0.5">Current</div>
          </div>
          <div className="divider divider-horizontal" />
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-base-content/60">{profile.longest_streak}</div>
            <div className="text-xs text-base-content/50 mt-0.5">Best</div>
          </div>
        </div>
        {profile.current_streak > 0 && (
          <p className="text-xs text-base-content/50 text-center mt-2">
            🔥 Keep it up! Complete a focus session to maintain your streak.
          </p>
        )}
      </div>
    </div>
  );
}
