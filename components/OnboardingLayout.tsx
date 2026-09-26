import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { Button } from './Button';
import { PageTitle } from './PageTitle';
import { PandaMascot } from './PandaMascot';
import { ProgressBar } from './ProgressBar';
import { ScreenContainer } from './ScreenContainer';

type Props = PropsWithChildren<{
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  // Short helper message from the panda, shown below the step's content.
  tip?: string;
  onBack?: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
}>;

export function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  tip,
  onBack,
  onContinue,
  continueDisabled,
  continueLabel = 'Continue',
  children,
}: Props) {
  return (
    <ScreenContainer scroll backgroundColor={colors.pageBackground}>
      <ProgressBar step={step} totalSteps={totalSteps} />
      <View className={subtitle ? 'mb-lg' : 'mb-sm'}>
        <PageTitle size="compact" title={title} subtitle={subtitle} />
      </View>

      {/* grow shrink-0 basis-0 matches React Native's `flex: 1` exactly;
          NativeWind's flex-1 compiles to CSS semantics (shrink 1, basis 0%). */}
      <View className="grow shrink-0 basis-0 mt-sm">{children}</View>

      {/* Outside the growing content area so it sits just above the buttons. */}
      {tip && (
        // Borderless pill so it reads as a note, not another selectable option.
        <View className="flex-row items-center mt-md rounded-full bg-primaryLight py-xs pl-xs pr-md">
          <View className="w-[44px] h-[44px] rounded-full bg-background items-center justify-center mr-sm">
            <PandaMascot size={32} />
          </View>
          <Text className="flex-1 text-[13px] leading-[18px] text-textPrimary">{tip}</Text>
        </View>
      )}

      <View className="flex-row gap-md mt-lg">
        {onBack && <Button label="Back" variant="outline" onPress={onBack} style={styles.backButton} />}
        <Button
          label={continueLabel}
          onPress={onContinue}
          disabled={continueDisabled}
          style={styles.continueButton}
        />
      </View>
    </ScreenContainer>
  );
}

// Button only accepts `style?: ViewStyle` (no className), so the flex ratios
// for the action buttons stay as StyleSheet styles.
const styles = StyleSheet.create({
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});
