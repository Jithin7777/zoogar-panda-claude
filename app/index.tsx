import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { PandaMascot } from '../components/PandaMascot';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, fontSize, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

export default function WelcomeScreen() {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (user) {
    return <Redirect href={profile.onboardingCompleted ? '/home' : '/onboarding/step-1'} />;
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.hero}>
        <PandaMascot size={160} />
        <Text style={styles.brand}>Zoogar Panda</Text>
        <Text style={styles.tagline}>Track your sugar. Build healthier habits.</Text>
        <Text style={styles.description}>
          Make small changes every day and build healthier habits with Zoogar Panda.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Get Started" onPress={() => router.push('/signup')} />
        <Button label="Log In" variant="outline" onPress={() => router.push('/login')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  brand: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  actions: {
    gap: spacing.md,
  },
});
