import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

// Testing helper only. Hidden automatically in production builds via __DEV__.
export function DevResetButton() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { resetProfile } = useProfile();

  if (!__DEV__) return null;

  const handleReset = async () => {
    await logout();
    await resetProfile();
    router.replace('/');
  };

  return (
    <Pressable style={[styles.button, { top: insets.top + spacing.sm }]} onPress={handleReset}>
      <Text style={styles.label}>Reset App Data</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: spacing.md,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    opacity: 0.9,
    zIndex: 999,
  },
  label: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
