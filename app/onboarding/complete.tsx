import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { PageTitle } from '../../components/PageTitle';
import { PandaMascot } from '../../components/PandaMascot';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../constants/theme';
import { useOnboardingDraft } from '../../hooks/useOnboardingDraft';

export default function OnboardingComplete() {
  const { draft, completeOnboarding } = useOnboardingDraft();
  const [isSaving, setIsSaving] = useState(false);
  const name = draft.name.trim();

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await completeOnboarding();
      router.replace('/home');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.pageBackground}>
      <View className="flex-1 items-center justify-center">
        <View className="w-[200px] h-[200px] rounded-full bg-primaryLight items-center justify-center">
          <PandaMascot size={150} />
        </View>

        <View className="mt-xl">
          <PageTitle
            centered
            size="celebration"
            title={name ? `You're all set, ${name}! 🎉` : "You're all set! 🎉"}
            subtitle="Let's start building healthier habits together."
          />
        </View>
      </View>

      <Button label="Continue" onPress={handleContinue} loading={isSaving} />
    </ScreenContainer>
  );
}
