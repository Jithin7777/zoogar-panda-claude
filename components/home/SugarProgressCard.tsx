import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../constants/theme';
import { Card } from '../Card';

type Props = {
  consumedGrams: number;
  goalGrams: number;
  lowLimitGrams: number;
  onEditGoalPress?: () => void;
};

const RING_SIZE = 115;
const RING_STROKE = 7;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_CENTER = RING_SIZE / 2;

const KNOB_SIZE = 12;

function getStatus(ratio: number) {
  if (ratio > 1) {
    return { label: 'Over Limit', pillClassName: 'bg-danger/10', textClassName: 'text-danger' };
  }
  if (ratio >= 0.9) {
    return { label: 'Near Limit', pillClassName: 'bg-warning/15', textClassName: 'text-warning' };
  }
  return { label: 'On Track! 🎯', pillClassName: 'bg-primaryLight', textClassName: 'text-primaryDark' };
}

function ProgressRing({ progress, percent }: { progress: number; percent: number }) {
  return (
    <View style={{ width: RING_SIZE, height: RING_SIZE }} className="items-center justify-center">
      <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
        <Defs>
          {/* The arc is rotated -90° so it starts at 12 o'clock; in its rotated
              space +x points up, so x1=1 → x2=0 runs dark (top) to light (bottom). */}
          <LinearGradient id="sugarRing" x1="1" y1="0" x2="0" y2="0">
            <Stop offset="0" stopColor={colors.primaryDark} />
            <Stop offset="1" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={RING_RADIUS}
          stroke={colors.border}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        {progress > 0 && (
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={RING_RADIUS}
            stroke="url(#sugarRing)"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            fill="none"
            transform={`rotate(-90 ${RING_CENTER} ${RING_CENTER})`}
          />
        )}
      </Svg>

      <Text className="text-xxl font-semibold text-textPrimary">{percent}%</Text>
      <Text className="text-xs text-textSecondary">of daily goal</Text>
    </View>
  );
}

export function SugarProgressCard({ consumedGrams, goalGrams, lowLimitGrams, onEditGoalPress }: Props) {
  const ratio = goalGrams > 0 ? consumedGrams / goalGrams : 0;
  const progress = Math.min(ratio, 1);
  const percent = Math.round(ratio * 100);
  const status = getStatus(ratio);

  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-textPrimary">Today's Sugar Progress</Text>
        <Pressable
          className="flex-row items-center active:opacity-70"
          onPress={onEditGoalPress}
          accessibilityRole="button"
          accessibilityLabel="Edit sugar goal"
          hitSlop={8}
        >
          <Text className="text-xs font-semibold text-primaryDark mr-xs">Edit Goal</Text>
          <Ionicons name="create-outline" size={16} color={colors.primaryDark} />
        </Pressable>
      </View>

      <View className="flex-row items-center mt-md">
        <ProgressRing progress={progress} percent={percent} />

        <View className="flex-1 ml-md">
          {/* <Text className="text-xs text-textSecondary">Total Sugar</Text>
          <Text className="text-lg font-bold text-primaryDark">
            {consumedGrams}g
            <Text className="text-sm font-medium text-textSecondary"> / {goalGrams}g</Text>
          </Text> */}

          <View className={`self-start rounded-full px-md py-xs mt-xs ${status.pillClassName}`}>
            <Text className={`text-xs font-semibold ${status.textClassName}`}>{status.label}</Text>
          </View>

          {/* Visual indicator only: mirrors the ring's percentage of the goal. */}
          <View className="justify-center mt-md" style={{ height: KNOB_SIZE }}>
            <View className="h-[4px] rounded-full bg-border overflow-hidden">
              <View className="h-full rounded-full bg-primaryDark" style={{ width: `${progress * 100}%` }} />
            </View>
            <View
              className="absolute rounded-full bg-primaryDark"
              style={{
                width: KNOB_SIZE,
                height: KNOB_SIZE,
                left: `${progress * 100}%`,
                marginLeft: -KNOB_SIZE / 2,
              }}
            />
          </View>

          <View className="flex-row justify-between mt-sm">
            <View className="items-start">
              <Text className="text-xs font-medium text-primary">Low</Text>
              <Text className="text-xs text-textSecondary">0–{lowLimitGrams}g</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs font-medium text-warning">Moderate</Text>
              <Text className="text-xs text-textSecondary">
                {lowLimitGrams}–{goalGrams}g
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-medium text-danger">High</Text>
              <Text className="text-xs text-textSecondary">{goalGrams}g+</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
