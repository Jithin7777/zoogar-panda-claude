import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '../components/Button';
import { PandaMascot } from '../components/PandaMascot';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export default function WelcomeScreen() {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (user) {
    return <Redirect href={profile.onboardingCompleted ? '/home' : '/onboarding/step-1'} />;
  }

  return (
    <ScreenContainer backgroundColor={colors.pageBackground}>
      <View className="flex-1 items-center justify-center">
        <View className="w-[200px] h-[200px] rounded-full bg-primaryLight items-center justify-center">
          <PandaMascot size={150} />
        </View>

        {/* Same wordmark as the Home navbar, at a larger size. */}
        <View className="flex-row items-start mt-xl">
          <Text className="text-xxl font-extrabold text-textPrimary">
            Zoogar <Text className="text-primary">Panda</Text>
          </Text>
          <Ionicons name="leaf" size={20} color={colors.primary} />
        </View>

        <Text className="text-md text-textSecondary text-center mt-sm">
          Track your sugar. Build healthier habits.
        </Text>
      </View>

      <View className="gap-md">
        <Button label="Get Started" onPress={() => router.push('/signup')} />
        <Button label="Log In" variant="outline" onPress={() => router.push('/login')} />
      </View>
    </ScreenContainer>
  );
}
