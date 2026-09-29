import { DateKey } from '../types/dailyLog';

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// The user's local calendar date as 'YYYY-MM-DD'. Never derive this from
// toISOString(), which gives the UTC date (e.g. early morning in UTC+5:30
// would land on the previous day).
export function toDateKey(date: Date): DateKey {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// True for a well-formed key of a real calendar date ('2026-02-30' is false).
export function isDateKey(value: string): boolean {
  const match = DATE_KEY_PATTERN.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  return toDateKey(new Date(Number(year), Number(month) - 1, Number(day))) === value;
}

// Built from local date parts, so daylight-saving shifts are handled.
export function msUntilNextLocalMidnight(now: Date): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime();
}
