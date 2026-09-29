import Slider from '@react-native-community/slider';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { SugarLevel } from '../types/dailyLog';

type Props = {
  // null until the user deliberately picks a level.
  value: SugarLevel | null;
  onChange: (value: SugarLevel) => void;
  disabled?: boolean;
};

// Slider positions: 0 = low, 1 = moderate, 2 = high.
const LEVELS: SugarLevel[] = ['low', 'moderate', 'high'];

// With nothing selected the thumb rests in the middle, styled as neutral.
const UNSELECTED_POSITION = 1;

export const SUGAR_LEVEL_LABELS: Record<SugarLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
};

const LEVEL_DESCRIPTIONS: Record<SugarLevel, string> = {
  low: 'Little or no added sugar',
  moderate: 'Some added sugar',
  high: 'A lot of added sugar',
};

// Same colors as the Low / Moderate / High labels in SugarProgressCard.
export const SUGAR_LEVEL_COLORS: Record<SugarLevel, string> = {
  low: colors.primary,
  moderate: colors.warning,
  high: colors.danger,
};

const selectedLabelClassName: Record<SugarLevel, string> = {
  low: 'text-primary',
  moderate: 'text-warning',
  high: 'text-danger',
};

// Left, center and right, lining up with the slider's three stops.
const labelAlignClassName = ['items-start', 'items-center', 'items-end'];

// Three-position Low / Moderate / High slider. UI and interaction only: the
// parent owns the value and decides what to do with it.
export function SugarLevelSlider({ value, onChange, disabled = false }: Props) {
  const position = value === null ? UNSELECTED_POSITION : LEVELS.indexOf(value);
  const color = value === null ? null : SUGAR_LEVEL_COLORS[value];

  const selectAt = (sliderPosition: number) => {
    const level = LEVELS[Math.round(sliderPosition)];
    if (level && level !== value) onChange(level);
  };

  return (
    <View className={disabled ? 'opacity-50' : undefined}>
      <View className="flex-row">
        {LEVELS.map((level, index) => {
          const selected = level === value;
          return (
            <Pressable
              key={level}
              className={`flex-1 min-h-[44px] justify-center active:opacity-70 ${labelAlignClassName[index]}`}
              onPress={() => onChange(level)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`${SUGAR_LEVEL_LABELS[level]} sugar: ${LEVEL_DESCRIPTIONS[level]}`}
              accessibilityState={{ selected, disabled }}
            >
              <Text
                className={`text-sm ${
                  selected ? `font-semibold ${selectedLabelClassName[level]}` : 'font-medium text-textSecondary'
                }`}
              >
                {SUGAR_LEVEL_LABELS[level]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={LEVELS.length - 1}
        step={1}
        value={position}
        onValueChange={selectAt}
        // Also fires when the thumb is tapped without moving, so the resting
        // middle position can be chosen deliberately.
        onSlidingComplete={selectAt}
        // Android jumps to a tapped track position natively; iOS needs this.
        tapToSeek
        disabled={disabled}
        minimumTrackTintColor={color ?? colors.border}
        maximumTrackTintColor={colors.border}
        thumbTintColor={color ?? colors.textSecondary}
        accessibilityLabel="Sugar level"
        accessibilityValue={{ text: value === null ? 'Not selected' : SUGAR_LEVEL_LABELS[value] }}
      />

      <Text className="text-xs text-textSecondary text-center">
        {value === null ? 'Choose the option closest to your meal.' : LEVEL_DESCRIPTIONS[value]}
      </Text>
    </View>
  );
}
