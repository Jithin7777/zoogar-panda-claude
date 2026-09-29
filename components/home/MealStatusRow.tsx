import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import { CheckInMeal } from '../../hooks/useMealCheckIn';
import { SUGAR_LEVEL_COLORS, SUGAR_LEVEL_LABELS } from '../SugarLevelSlider';

type Props = {
  meals: CheckInMeal[];
  // The meal the card is currently showing, highlighted.
  highlightedIndex: number | null;
  // Called for unlogged meals; the card decides what a tap does.
  onSelectMeal: (mealIndex: number) => void;
};

function statusText(meal: CheckInMeal) {
  if (meal.entry) return SUGAR_LEVEL_LABELS[meal.entry.level];
  if (meal.status === 'current') return 'Now';
  if (meal.status === 'missed') return 'Missed';
  return meal.opensAtLabel;
}

const statusClassName: Record<CheckInMeal['status'], string> = {
  logged: 'text-textPrimary',
  current: 'text-primaryDark font-semibold',
  missed: 'text-warning font-semibold',
  upcoming: 'text-textSecondary',
};

// One compact item per meal: logged (✓ + level), Now, Missed or opening time.
export function MealStatusRow({ meals, highlightedIndex, onSelectMeal }: Props) {
  return (
    <View className="flex-row gap-xs">
      {meals.map((meal) => {
        const highlighted = meal.mealIndex === highlightedIndex;
        const logged = meal.entry !== null;
        const status = statusText(meal);

        return (
          <Pressable
            key={meal.mealIndex}
            className={`flex-1 min-h-[44px] items-center justify-center rounded-sm border px-xs py-xs active:opacity-70 ${
              highlighted ? 'border-primary bg-primaryLight' : 'border-border bg-background'
            }`}
            onPress={() => onSelectMeal(meal.mealIndex)}
            disabled={logged}
            accessibilityRole="button"
            accessibilityLabel={`${meal.name}, ${logged ? `saved as ${status}` : meal.status === 'upcoming' ? `opens at ${status}` : status}`}
            accessibilityState={{ selected: highlighted, disabled: logged }}
          >
            <Text className="text-xs font-semibold text-textPrimary" numberOfLines={1}>
              {meal.name}
            </Text>
            <View className="flex-row items-center mt-[2px]">
              {meal.entry && (
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color={SUGAR_LEVEL_COLORS[meal.entry.level]}
                  style={{ marginRight: 2 }}
                />
              )}
              {meal.status === 'upcoming' && (
                <Ionicons name="time-outline" size={11} color={colors.textSecondary} style={{ marginRight: 2 }} />
              )}
              <Text className={`text-[11px] ${statusClassName[meal.status]}`} numberOfLines={1}>
                {status}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
