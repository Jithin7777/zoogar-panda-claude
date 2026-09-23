import { router } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { useProfile } from '../../context/ProfileContext';
import { Goal } from '../../types/user';

const options: { label: string; value: Goal }[] = [
  { label: 'Reduce my sugar intake', value: 'reduce_sugar' },
  { label: 'Maintain my current habits', value: 'maintain_habits' },
  { label: 'Build healthier eating habits', value: 'build_healthier_habits' },
];

export default function OnboardingStepFour() {
  const { profile, updateDraft } = useProfile();

  return (
    <OnboardingLayout
      step={4}
      totalSteps={4}
      title="What is your main goal?"
      onBack={() => router.back()}
      onContinue={() => router.push('/onboarding/complete')}
      continueDisabled={!profile.goal}
      continueLabel="Finish"
    >
      {options.map((option) => (
        <SelectableOption
          key={option.value}
          label={option.label}
          selected={profile.goal === option.value}
          onPress={() => updateDraft({ goal: option.value })}
        />
      ))}
    </OnboardingLayout>
  );
}
