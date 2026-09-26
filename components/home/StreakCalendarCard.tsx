import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { MOCK_STREAK_CALENDAR, StreakWeekState } from '../../lib/mockHome';
import { Card } from '../Card';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const WEEKDAY_ROW_HEIGHT = 28;
const ROW_HEIGHT = 38;
const DAY_SIZE = 26;

const STREAK_COLUMN_WIDTH = 32;
const WEEK_MARKER_SIZE = 16;
const FLAME_SIZE = 34;

type DayState = 'activity' | 'past' | 'selected' | 'future' | 'outside';

type DayCell = {
  date: Date;
  iso: string;
  state: DayState;
  hasExtraActivity: boolean;
};

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Monday-first weeks covering the whole month, padded with the neighbouring
// months' days so every row has 7 cells.
function buildWeeks(): DayCell[][] {
  const { year, month, selectedDay, activityDates, multiActivityDates } = MOCK_STREAK_CALENDAR;
  const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((leadingDays + daysInMonth) / 7);

  const weeks: DayCell[][] = [];
  for (let week = 0; week < weekCount; week++) {
    const cells: DayCell[] = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      const date = new Date(year, month, 1 - leadingDays + week * 7 + weekday);
      const iso = toIsoDate(date);
      const inMonth = date.getMonth() === month;

      let state: DayState;
      if (activityDates.includes(iso)) state = 'activity';
      else if (!inMonth) state = 'outside';
      else if (date.getDate() === selectedDay) state = 'selected';
      else if (date.getDate() > selectedDay) state = 'future';
      else state = 'past';

      cells.push({ date, iso, state, hasExtraActivity: multiActivityDates.includes(iso) });
    }
    weeks.push(cells);
  }
  return weeks;
}

const dayCircleClassName: Record<Exclude<DayState, 'outside'>, string> = {
  activity: 'bg-primary',
  past: 'bg-border',
  selected: 'bg-background border-2 border-primaryDark',
  future: 'border border-textSecondary/30',
};

function CalendarDay({ date, state, hasExtraActivity }: DayCell) {
  const label = `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}${
    state === 'activity' ? ', activity completed' : ''
  }`;

  if (state === 'outside') {
    return (
      <Text className="text-[13px] font-medium text-textSecondary/50" accessibilityLabel={label}>
        {date.getDate()}
      </Text>
    );
  }

  return (
    <View
      className={`rounded-full items-center justify-center ${dayCircleClassName[state]}`}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      accessible
      accessibilityLabel={label}
    >
      {state === 'activity' ? (
        <Ionicons name="checkmark" size={16} color={colors.white} />
      ) : (
        <Text className="text-[13px] font-medium text-textPrimary">{date.getDate()}</Text>
      )}
      {hasExtraActivity && (
        <View className="absolute top-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full bg-primaryDark border-2 border-background" />
      )}
    </View>
  );
}

// Right-hand column: one marker per week row, with a capsule behind the
// streak weeks and the flame spilling past its bottom edge.
function StreakColumn({ weekStates, streakCount }: { weekStates: StreakWeekState[]; streakCount: number }) {
  const firstStreakWeek = weekStates.findIndex((state) => state !== 'future');
  const currentWeek = weekStates.indexOf('current');

  return (
    <View
      className="ml-sm"
      style={{ width: STREAK_COLUMN_WIDTH, paddingTop: WEEKDAY_ROW_HEIGHT }}
      accessible
      accessibilityLabel={`${streakCount} week streak`}
    >
      {firstStreakWeek !== -1 && currentWeek !== -1 && (
        <View
          className="absolute left-0 right-0 rounded-full bg-warning/20"
          style={{
            top: WEEKDAY_ROW_HEIGHT + firstStreakWeek * ROW_HEIGHT - 4,
            height: (currentWeek - firstStreakWeek) * ROW_HEIGHT + ROW_HEIGHT / 2 + 16,
          }}
        />
      )}

      {weekStates.map((state, index) => (
        <View key={index} className="items-center justify-center" style={{ height: ROW_HEIGHT }}>
          {state === 'done' && (
            <View
              className="rounded-full bg-warning items-center justify-center"
              style={{ width: WEEK_MARKER_SIZE, height: WEEK_MARKER_SIZE }}
            >
              <Ionicons name="checkmark" size={11} color={colors.textPrimary} />
            </View>
          )}
          {state === 'current' && (
            // Nudged down so the flame extends past the capsule's bottom edge.
            <View className="items-center justify-center" style={{ width: FLAME_SIZE, height: FLAME_SIZE, marginTop: -4 }}>
              <Ionicons name="flame" size={FLAME_SIZE} color={colors.warning} />
              <Text className="absolute text-sm font-extrabold text-textPrimary" style={{ top: FLAME_SIZE * 0.42 }}>
                {streakCount}
              </Text>
            </View>
          )}
          {state === 'future' && (
            <View
              className="rounded-full border border-textSecondary/30"
              style={{ width: WEEK_MARKER_SIZE, height: WEEK_MARKER_SIZE }}
            />
          )}
        </View>
      ))}
    </View>
  );
}

export function StreakCalendarCard() {
  const { year, month, streakLabel, streakActivities, streakCount, weekStates } = MOCK_STREAK_CALENDAR;
  const weeks = buildWeeks();

  return (
    // Slightly tighter padding than the default Card so the 7-column grid
    // plus the streak column keep the reference proportions.
    <Card style={{ padding: spacing.md }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-md font-bold text-textPrimary">
          {MONTH_NAMES[month]} {year}
        </Text>

        {/* Visual only for now; sharing is not implemented yet. */}
        <Pressable
          className="flex-row items-center rounded-full border-[1.5px] border-textPrimary px-md py-sm active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Share streak"
        >
          <Ionicons name="share-social-outline" size={16} color={colors.textPrimary} />
          <Text className="text-sm font-semibold text-textPrimary ml-xs">Share</Text>
        </Pressable>
      </View>

      <View className="flex-row mt-md">
        <View className="mr-xl">
          <Text className="text-xs text-textSecondary">Your Streak</Text>
          <Text className="text-lg font-bold text-textPrimary">{streakLabel}</Text>
        </View>
        <View>
          <Text className="text-xs text-textSecondary">Streak Activities</Text>
          <Text className="text-lg font-bold text-textPrimary">{streakActivities}</Text>
        </View>
      </View>

      <View className="flex-row mt-md">
        <View className="flex-1">
          <View className="flex-row" style={{ height: WEEKDAY_ROW_HEIGHT }}>
            {WEEKDAY_LABELS.map((label, index) => (
              <View key={index} className="flex-1 items-center justify-center">
                <Text className="text-sm text-textSecondary">{label}</Text>
              </View>
            ))}
          </View>

          {weeks.map((cells) => (
            <View key={cells[0].iso} className="flex-row" style={{ height: ROW_HEIGHT }}>
              {cells.map((cell) => (
                <View key={cell.iso} className="flex-1 items-center justify-center">
                  <CalendarDay {...cell} />
                </View>
              ))}
            </View>
          ))}
        </View>

        <StreakColumn weekStates={weekStates} streakCount={streakCount} />
      </View>
    </Card>
  );
}
