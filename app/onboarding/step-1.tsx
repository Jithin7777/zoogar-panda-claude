import { router } from 'expo-router';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { TextField } from '../../components/TextField';
import { useProfile } from '../../context/ProfileContext';

export default function OnboardingStepOne() {
  const { profile, updateDraft } = useProfile();

  const canContinue = profile.name.trim().length > 0 && profile.age.trim().length > 0;

  return (
    <OnboardingLayout
      step={1}
      totalSteps={4}
      title="Let's get to know you"
      onContinue={() => router.push('/onboarding/step-2')}
      continueDisabled={!canContinue}
    >
      <TextField
        label="Name"
        placeholder="Your name"
        value={profile.name}
        onChangeText={(name) => updateDraft({ name })}
      />
      <TextField
        label="Age"
        placeholder="Your age"
        keyboardType="number-pad"
        value={profile.age}
        onChangeText={(age) => updateDraft({ age })}
      />
    </OnboardingLayout>
  );
}
