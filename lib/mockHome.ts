// Mock Home data until real tracking exists.
export const MOCK_STREAK_DAYS = 12;

export const MOCK_SUGAR_TODAY = {
  consumedGrams: 54,
  goalGrams: 80,
  // Upper bound of the "Low" range; "Moderate" runs from here to the goal.
  lowLimitGrams: 40,
};

export type StreakWeekState = 'done' | 'current' | 'future';

// Static calendar data matching the design reference; no real streak logic yet.
export const MOCK_STREAK_CALENDAR = {
  year: 2026,
  // 0-based, as used by Date: 8 = September.
  month: 8,
  selectedDay: 24,
  streakLabel: '4 Weeks',
  streakActivities: 7,
  streakCount: 4,
  // ISO dates (YYYY-MM-DD) with a completed healthy-habit activity.
  activityDates: ['2026-08-31', '2026-09-06', '2026-09-09', '2026-09-15', '2026-09-17', '2026-09-22'],
  // Days with more than one activity, shown with a small extra dot.
  multiActivityDates: ['2026-09-06'],
  // One entry per calendar week row, top to bottom.
  weekStates: ['done', 'done', 'done', 'current', 'future'] as StreakWeekState[],
};
