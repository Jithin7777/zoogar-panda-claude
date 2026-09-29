import { z } from 'zod';
import {
  DailyLog,
  DateKey,
  LogMealFailureReason,
  MealEntry,
  MealPlanSnapshot,
  SugarLevel,
} from '../types/dailyLog';
import { isDateKey } from './dates';
import { mealFrequencySchema } from './validation';

// Daily-log business rules, kept as plain functions so they can be tested
// without Zustand or AsyncStorage.

type AddMealEntryInput = {
  date: DateKey;
  // The current local date; only today's log can be written.
  todayKey: DateKey;
  mealIndex: number;
  level: SugarLevel;
  // Used only when this creates the day; an existing day keeps its saved plan.
  plan: MealPlanSnapshot;
  loggedAt: string;
};

type AddMealEntryResult =
  | { ok: true; log: DailyLog; entry: MealEntry }
  | { ok: false; reason: LogMealFailureReason };

const byMealIndex = (a: MealEntry, b: MealEntry) => a.mealIndex - b.mealIndex;

export function addMealEntry(existing: DailyLog | undefined, input: AddMealEntryInput): AddMealEntryResult {
  // Past days are never rewritten.
  if (input.date !== input.todayKey) return { ok: false, reason: 'dayChanged' };

  const log: DailyLog = existing ?? { date: input.date, plan: input.plan, entries: [] };
  const { mealIndex } = input;

  if (!Number.isInteger(mealIndex) || mealIndex < 0 || mealIndex >= log.plan.expectedMeals) {
    return { ok: false, reason: 'invalidMealIndex' };
  }
  // No editing: a logged meal can't be logged again (Undo removes it instead).
  if (log.entries.some((entry) => entry.mealIndex === mealIndex)) {
    return { ok: false, reason: 'alreadyLogged' };
  }

  const entry: MealEntry = { mealIndex, level: input.level, loggedAt: input.loggedAt };
  return { ok: true, log: { ...log, entries: [...log.entries, entry].sort(byMealIndex) }, entry };
}

type RemoveMealEntryInput = {
  date: DateKey;
  todayKey: DateKey;
  mealIndex: number;
  loggedAt: string;
};

// Undo for the entry just saved: only today's log, and only the entry whose
// mealIndex AND loggedAt both match, so it can never remove an older entry.
// Returns the updated log (null when the day is left empty, so the current
// profile plan applies again), or undefined when nothing was removed.
export function removeMealEntry(
  existing: DailyLog | undefined,
  input: RemoveMealEntryInput,
): DailyLog | null | undefined {
  if (!existing || input.date !== input.todayKey) return undefined;

  const entries = existing.entries.filter(
    (entry) => !(entry.mealIndex === input.mealIndex && entry.loggedAt === input.loggedAt),
  );
  if (entries.length === existing.entries.length) return undefined;

  return entries.length === 0 ? null : { ...existing, entries };
}

export type MealSlot = { mealIndex: number; entry: MealEntry | null };

export type DaySummary = {
  slots: MealSlot[];
  expectedMeals: number;
  loggedCount: number;
  // Lowest meal index not yet logged; null once every meal is logged.
  nextMealIndex: number | null;
  isComplete: boolean;
  // Share of the day's meals logged, 0–1. Meal completion, not sugar.
  progress: number;
};

export function summarizeDay(plan: MealPlanSnapshot, entries: MealEntry[]): DaySummary {
  const { expectedMeals } = plan;
  const slots: MealSlot[] = Array.from({ length: expectedMeals }, (_, mealIndex) => ({
    mealIndex,
    entry: entries.find((entry) => entry.mealIndex === mealIndex) ?? null,
  }));
  const loggedCount = slots.filter((slot) => slot.entry !== null).length;
  const nextSlot = slots.find((slot) => slot.entry === null);

  return {
    slots,
    expectedMeals,
    loggedCount,
    nextMealIndex: nextSlot ? nextSlot.mealIndex : null,
    isComplete: loggedCount === expectedMeals,
    progress: expectedMeals > 0 ? loggedCount / expectedMeals : 0,
  };
}

const mealEntrySchema = z.object({
  mealIndex: z.number().int().nonnegative(),
  level: z.enum(['low', 'moderate', 'high']),
  loggedAt: z.iso.datetime(),
});

const dailyLogSchema = z
  .object({
    date: z.string().refine(isDateKey),
    plan: z.object({
      mealsPerDay: mealFrequencySchema.shape.mealsPerDay,
      expectedMeals: z.number().int().positive(),
    }),
    entries: z.array(mealEntrySchema),
  })
  .refine((log) => {
    const indexes = log.entries.map((entry) => entry.mealIndex);
    return (
      indexes.every((index) => index < log.plan.expectedMeals) && new Set(indexes).size === indexes.length
    );
  });

const persistedLogsSchema = z.object({ logs: z.record(z.string(), z.unknown()) });

// Validates stored logs day by day, so one bad day doesn't wipe the history.
// Returns null when the stored value isn't a logs container at all.
export function parsePersistedLogs(
  persisted: unknown,
): { logs: Record<DateKey, DailyLog>; droppedDays: number } | null {
  const container = persistedLogsSchema.safeParse(persisted);
  if (!container.success) return null;

  const logs: Record<DateKey, DailyLog> = {};
  let droppedDays = 0;
  for (const [dateKey, value] of Object.entries(container.data.logs)) {
    const day = dailyLogSchema.safeParse(value);
    if (day.success && day.data.date === dateKey) {
      logs[dateKey] = { ...day.data, entries: [...day.data.entries].sort(byMealIndex) };
    } else {
      droppedDays += 1;
    }
  }
  return { logs, droppedDays };
}
