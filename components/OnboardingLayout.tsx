import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { ScreenContainer } from './ScreenContainer';
import { colors, fontSize, spacing } from '../constants/theme';

type Props = PropsWithChildren<{
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
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
  onBack,
  onContinue,
  continueDisabled,
  continueLabel = 'Continue',
  children,
}: Props) {
  return (
    <ScreenContainer scroll>
      <ProgressBar step={step} totalSteps={totalSteps} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.content}>{children}</View>

      <View style={styles.actions}>
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

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});
