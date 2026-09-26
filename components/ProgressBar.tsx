import { Text, View } from 'react-native';

type Props = {
  step: number;
  totalSteps: number;
};

export function ProgressBar({ step, totalSteps }: Props) {
  const progress = step / totalSteps;

  return (
    <View className="mb-lg">
      <Text className="text-[13px] font-medium text-textSecondary mb-sm">
        Step {step} of {totalSteps}
      </Text>
      <View className="h-[8px] rounded-full bg-border overflow-hidden">
        <View className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );
}
