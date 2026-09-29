import { useEffect } from 'react';
import { AppState } from 'react-native';
import { msUntilNextLocalMidnight } from '../lib/dates';
import { useDailyLogStore } from '../stores/dailyLogStore';

// Fires slightly after midnight so a timer that runs a little early still
// lands on the new day.
const MIDNIGHT_BUFFER_MS = 1000;

// Keeps the daily-log store's todayKey on the current local date while the app
// runs. Only "today" moves; logged days are never touched. Mount once (AppGate).
export function useDayRollover() {
  useEffect(() => {
    const refreshToday = () => useDailyLogStore.getState().refreshToday();
    let midnightTimer: ReturnType<typeof setTimeout>;

    const scheduleMidnightRefresh = () => {
      clearTimeout(midnightTimer);
      midnightTimer = setTimeout(() => {
        refreshToday();
        scheduleMidnightRefresh();
      }, msUntilNextLocalMidnight(new Date()) + MIDNIGHT_BUFFER_MS);
    };

    refreshToday();
    scheduleMidnightRefresh();

    // JS timers pause in the background, so re-check whenever the app resumes.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      refreshToday();
      scheduleMidnightRefresh();
    });

    return () => {
      clearTimeout(midnightTimer);
      subscription.remove();
    };
  }, []);
}
