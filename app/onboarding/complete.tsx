import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Button } from '../../components/Button';
import { PandaMascot } from '../../components/PandaMascot';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useProfile } from '../../context/ProfileContext';

export default function OnboardingComplete() {
  const { completeOnboarding } = useProfile();

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace('/home');
  };

  return (
    <ScreenContainer style={styles.container}>
      <PandaMascot size={160} />
      <Text style={styles.title}>You're all set! 🎉</Text>
      <Text style={styles.subtitle}>Let's start building healthier habits together.</Text>
      <Button label="Continue" onPress={handleContinue} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    width: '100%',
  },
});
