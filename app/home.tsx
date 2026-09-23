import { StyleSheet, Text } from 'react-native';
import { Card } from '../components/Card';
import { PandaMascot } from '../components/PandaMascot';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, fontSize, spacing } from '../constants/theme';
import { useProfile } from '../context/ProfileContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const { profile } = useProfile();

  return (
    <ScreenContainer style={styles.container}>
      <PandaMascot size={120} />
      <Text style={styles.greeting}>
        {getGreeting()}
        {profile.name ? `, ${profile.name}` : ''}!
      </Text>
      <Text style={styles.welcome}>Welcome to Zoogar Panda 🐼</Text>

      <Card style={styles.card}>
        <Text style={styles.cardText}>
          Your sugar tracking dashboard is coming soon. For now, enjoy exploring the app!
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  welcome: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  card: {
    width: '100%',
  },
  cardText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
