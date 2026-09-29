import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import { useLogMeal } from '../../hooks/useLogMeal';
import { CheckInMeal, useMealCheckIn } from '../../hooks/useMealCheckIn';
import { MealEntry, SugarLevel } from '../../types/dailyLog';
import { Button } from '../Button';
import { Card } from '../Card';
import { SUGAR_LEVEL_LABELS, SugarLevelSlider } from '../SugarLevelSlider';
import { MealStatusRow } from './MealStatusRow';

type JustSaved = { name: string; entry: MealEntry };

function CardShell({ children }: { children: ReactNode }) {
  return (
    <Card>
      <Text className="text-sm font-semibold text-textPrimary">Meal Check-in</Text>
      {children}
    </Card>
  );
}

// Icon-in-a-tinted-circle message, matching the streak badge style in HomeWelcome.
function StatusMessage({
  icon,
  tone,
  children,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  tone: 'success' | 'neutral';
  children: ReactNode;
}) {
  const success = tone === 'success';
  return (
    <View className="flex-row items-center">
      <View
        className={`w-[44px] h-[44px] rounded-full items-center justify-center mr-sm ${
          success ? 'bg-primaryLight' : 'bg-surface'
        }`}
      >
        <Ionicons name={icon} size={24} color={success ? colors.primary : colors.textSecondary} />
      </View>
      <Text className={`flex-1 text-sm ${success ? 'font-semibold text-primaryDark' : 'text-textPrimary'}`}>
        {children}
      </Text>
    </View>
  );
}

function TextAction({ label, onPress, emphasized }: { label: string; onPress: () => void; emphasized?: boolean }) {
  return (
    <Pressable
      className="min-h-[44px] justify-center px-md active:opacity-70"
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={4}
    >
      <Text className={`text-sm font-semibold ${emphasized ? 'text-primaryDark' : 'text-textSecondary'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

const opensAtText = (meal: CheckInMeal) => `${meal.name} check-in opens at ${meal.opensAtLabel}.`;

// Collects a Low / Moderate / High rating for each meal around its meal time.
// Which meals can be logged comes from useMealCheckIn; the chosen level stays
// local until it is saved.
export function DailySugarIntakeCard() {
  const checkIn = useMealCheckIn();
  const { logMeal, undoMeal } = useLogMeal();
  const [level, setLevel] = useState<SugarLevel | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const [justSaved, setJustSaved] = useState<JustSaved | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Updated synchronously, so a second tap handled before the success view
  // renders can be recognised as a duplicate of the save that just happened.
  const lastSavedEntry = useRef<MealEntry | null>(null);

  if (checkIn.status === 'incompleteProfile') {
    return (
      <CardShell>
        <Text className="text-sm text-textSecondary mt-md">
          Tell us how many meals you usually eat to start your check-ins.
        </Text>
      </CardShell>
    );
  }
  if (checkIn.status === 'unsupportedMealPlan') {
    return (
      <CardShell>
        <Text className="text-sm text-textSecondary mt-md">
          Check-ins for 5 or more meals a day are coming soon.
        </Text>
      </CardShell>
    );
  }
  if (checkIn.status === 'scheduleUnavailable') {
    return (
      <CardShell>
        <Text className="text-sm text-textSecondary mt-md">
          Check-ins for {checkIn.expectedMeals} meals a day are coming soon.
        </Text>
      </CardShell>
    );
  }

  const { meals, defaultFocusIndex, nextUpcoming, loggedCount, isComplete } = checkIn;
  const selectedMeal = selectedMealIndex === null ? undefined : meals[selectedMealIndex];
  // A tapped upcoming meal only previews its opening time.
  const previewMeal = selectedMeal?.status === 'upcoming' ? selectedMeal : undefined;
  const focusMeal =
    (selectedMeal?.canLog ? selectedMeal : undefined) ??
    (defaultFocusIndex === null ? undefined : meals[defaultFocusIndex]);

  const highlightedIndex = justSaved
    ? justSaved.entry.mealIndex
    : (previewMeal?.mealIndex ?? focusMeal?.mealIndex ?? null);

  const selectMeal = (mealIndex: number) => {
    setSelectedMealIndex(mealIndex);
    setLevel(null);
    setErrorMessage(null);
    setJustSaved(null);
  };

  const handleSave = (meal: CheckInMeal) => {
    if (level === null) return;
    const result = logMeal(meal.mealIndex, level);

    if (result.ok) {
      lastSavedEntry.current = result.entry;
      setJustSaved({ name: meal.name, entry: result.entry });
      setLevel(null);
      setSelectedMealIndex(null);
      setErrorMessage(null);
      return;
    }

    switch (result.reason) {
      case 'dayChanged':
        // The card re-renders for the new day.
        setLevel(null);
        setSelectedMealIndex(null);
        setErrorMessage(null);
        return;
      case 'alreadyLogged':
        // A double tap on the save that just succeeded: nothing to report.
        if (lastSavedEntry.current?.mealIndex === meal.mealIndex) return;
        setErrorMessage('This meal is already saved.');
        return;
      case 'mealNotOpenYet':
        setErrorMessage(opensAtText(meal));
        return;
      default:
        setErrorMessage("Couldn't save this meal. Please try again.");
    }
  };

  const handleUndo = () => {
    if (justSaved && undoMeal(justSaved.entry)) {
      // Back to the same meal for a fresh, deliberate choice.
      setSelectedMealIndex(justSaved.entry.mealIndex);
    }
    lastSavedEntry.current = null;
    setJustSaved(null);
    setLevel(null);
  };

  const handleContinue = () => {
    setJustSaved(null);
    setSelectedMealIndex(null);
  };

  let body: ReactNode;
  if (justSaved) {
    body = (
      <>
        <StatusMessage icon="checkmark" tone="success">
          {justSaved.name} saved · {SUGAR_LEVEL_LABELS[justSaved.entry.level]}
        </StatusMessage>
        <View className="flex-row justify-center mt-sm">
          <TextAction label="Undo" onPress={handleUndo} />
          <TextAction label="Continue" onPress={handleContinue} emphasized />
        </View>
      </>
    );
  } else if (previewMeal) {
    body = (
      <StatusMessage icon="time-outline" tone="neutral">
        {opensAtText(previewMeal)}
      </StatusMessage>
    );
  } else if (isComplete) {
    body = (
      <StatusMessage icon="checkmark" tone="success">
        All meals checked in for today. Nice work!
      </StatusMessage>
    );
  } else if (focusMeal) {
    const mealName = focusMeal.name;
    body = (
      <>
        {focusMeal.status === 'missed' && (
          <View className="self-start rounded-full bg-warning/15 px-sm py-[2px] mb-sm">
            <Text className="text-xs font-semibold text-warning">Missed · you can still log it</Text>
          </View>
        )}
        <Text className="text-md font-semibold text-textPrimary">
          How would you rate the sugar in your {mealName.toLowerCase()}?
        </Text>

        <View className="mt-sm">
          <SugarLevelSlider value={level} onChange={setLevel} />
        </View>

        <View className="mt-md">
          <Button
            label={level === null ? `Save ${mealName}` : `Save ${mealName} · ${SUGAR_LEVEL_LABELS[level]}`}
            onPress={() => handleSave(focusMeal)}
            disabled={level === null}
          />
        </View>

        {errorMessage && <Text className="text-xs text-danger text-center mt-sm">{errorMessage}</Text>}
      </>
    );
  } else if (nextUpcoming) {
    body = (
      <StatusMessage icon="time-outline" tone="neutral">
        {loggedCount === 0 ? opensAtText(nextUpcoming) : `You're all caught up. ${opensAtText(nextUpcoming)}`}
      </StatusMessage>
    );
  }

  return (
    <CardShell>
      <View className="mt-md">
        <MealStatusRow meals={meals} highlightedIndex={highlightedIndex} onSelectMeal={selectMeal} />
      </View>
      <View className="mt-md">{body}</View>
    </CardShell>
  );
}
