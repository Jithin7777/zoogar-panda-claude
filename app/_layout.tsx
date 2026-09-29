import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DevResetButton } from '../components/DevResetButton';
import { colors } from '../constants/theme';
import { useDayRollover } from '../hooks/useDayRollover';
import { useStoresHydrated } from '../hooks/useStoresHydrated';
import { clearLegacyStorageOnce } from '../lib/storage';

function AppGate() {
  const storesHydrated = useStoresHydrated();
  useDayRollover();

  useEffect(() => {
    if (storesHydrated) clearLegacyStorageOnce();
  }, [storesHydrated]);

  if (!storesHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Stack screenOptions={{ headerShown: false }} />
      <DevResetButton />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppGate />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
