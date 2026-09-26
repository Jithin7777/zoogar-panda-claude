import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DevResetButton } from '../components/DevResetButton';
import { colors } from '../constants/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProfileProvider, useProfile } from '../context/ProfileContext';

function AppGate() {
  const { isLoading: authLoading } = useAuth();
  const { isLoading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
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
      <AuthProvider>
        <ProfileProvider>
          <AppGate />
        </ProfileProvider>
      </AuthProvider>
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
