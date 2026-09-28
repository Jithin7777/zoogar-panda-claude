import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { useOnboardingDraft } from '../../hooks/useOnboardingDraft';
import { StepFourValues, stepFourSchema } from '../../lib/validation';
import { Goal } from '../../types/user';

const options: { label: string; value: Goal }[] = [
  { label: 'Reduce my sugar intake', value: 'reduce_sugar' },
  { label: 'Maintain my current habits', value: 'maintain_habits' },
  { label: 'Build healthier eating habits', value: 'build_healthier_habits' },
];

export default function OnboardingStepFour() {
  const { draft, updateDraft } = useOnboardingDraft();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<StepFourValues>({
    resolver: zodResolver(stepFourSchema),
    mode: 'onChange',
    defaultValues: { goal: draft.goal },
  });

  return (
    <OnboardingLayout
      step={4}
      totalSteps={5}
      title="What is your main goal?"
      subtitle="Choose the goal that best fits you."
      tip="Pick the goal that feels right to you."
      onBack={() => router.back()}
      onContinue={handleSubmit(() => router.push('/onboarding/meal-frequency'))}
      continueDisabled={!isValid}
    >
      <Controller
        control={control}
        name="goal"
        render={({ field: { value, onChange } }) => (
          <>
            {options.map((option) => (
              <SelectableOption
                key={option.value}
                label={option.label}
                selected={value === option.value}
                onPress={() => {
                  onChange(option.value);
                  updateDraft({ goal: option.value });
                }}
              />
            ))}
          </>
        )}
      />
    </OnboardingLayout>
  );
}
