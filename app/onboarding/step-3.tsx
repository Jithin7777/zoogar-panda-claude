import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { useOnboardingDraft } from '../../hooks/useOnboardingDraft';
import { StepThreeValues, stepThreeSchema } from '../../lib/validation';
import { SugarFrequency } from '../../types/user';

const options: { label: string; value: SugarFrequency }[] = [
  { label: 'Rarely', value: 'rarely' },
  { label: 'Sometimes', value: 'sometimes' },
  { label: 'Daily', value: 'daily' },
  { label: 'Several times a day', value: 'several_times_daily' },
];

export default function OnboardingStepThree() {
  const { draft, updateDraft } = useOnboardingDraft();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<StepThreeValues>({
    resolver: zodResolver(stepThreeSchema),
    mode: 'onChange',
    defaultValues: { sugarConsumptionFrequency: draft.sugarConsumptionFrequency },
  });

  return (
    <OnboardingLayout
      step={3}
      totalSteps={5}
      title="Tell us about your sugar habits"
      subtitle="How often do you consume sugary foods or drinks?"
      tip="This helps me understand your habits."
      onBack={() => router.back()}
      onContinue={handleSubmit(() => router.push('/onboarding/step-4'))}
      continueDisabled={!isValid}
    >
      <Controller
        control={control}
        name="sugarConsumptionFrequency"
        render={({ field: { value, onChange } }) => (
          <>
            {options.map((option) => (
              <SelectableOption
                key={option.value}
                label={option.label}
                selected={value === option.value}
                onPress={() => {
                  onChange(option.value);
                  updateDraft({ sugarConsumptionFrequency: option.value });
                }}
              />
            ))}
          </>
        )}
      />
    </OnboardingLayout>
  );
}
