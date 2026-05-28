import { differenceInCalendarDays, parseISO } from "date-fns";

export type StreakResult = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
};

export function calculateStreak(
  lastActiveDateStr: string | null,
  currentStreak: number,
  longestStreak: number
): StreakResult {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  if (!lastActiveDateStr) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(longestStreak, 1),
      lastActiveDate: todayStr,
    };
  }

  const lastActive = parseISO(lastActiveDateStr);
  const daysDiff = differenceInCalendarDays(today, lastActive);

  if (daysDiff === 0) {
    // Already logged today — no change
    return {
      currentStreak,
      longestStreak,
      lastActiveDate: lastActiveDateStr,
    };
  }

  let newStreak: number;
  if (daysDiff === 1) {
    // Consecutive day
    newStreak = currentStreak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  const newLongest = Math.max(longestStreak, newStreak);

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: todayStr,
  };
}
