import { router } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { useProfile } from '../../context/ProfileContext';
import { SugarFrequency } from '../../types/user';

const options: { label: string; value: SugarFrequency }[] = [
  { label: 'Rarely', value: 'rarely' },
  { label: 'Sometimes', value: 'sometimes' },
  { label: 'Daily', value: 'daily' },
  { label: 'Several times a day', value: 'several_times_daily' },
];

export default function OnboardingStepThree() {
  const { profile, updateDraft } = useProfile();

  return (
    <OnboardingLayout
      step={3}
      totalSteps={4}
      title="Tell us about your sugar habits"
      subtitle="How often do you consume sugary foods or drinks?"
      onBack={() => router.back()}
      onContinue={() => router.push('/onboarding/step-4')}
      continueDisabled={!profile.sugarConsumptionFrequency}
    >
      {options.map((option) => (
        <SelectableOption
          key={option.value}
          label={option.label}
          selected={profile.sugarConsumptionFrequency === option.value}
          onPress={() => updateDraft({ sugarConsumptionFrequency: option.value })}
        />
      ))}
    </OnboardingLayout>
  );
}
