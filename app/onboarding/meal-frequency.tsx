import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { useProfile } from '../../context/ProfileContext';
import { MealFrequencyValues, mealFrequencySchema } from '../../lib/validation';
import { MealsPerDay } from '../../types/user';

const options: { label: string; value: MealsPerDay }[] = [
  { label: '1 meal', value: '1' },
  { label: '2 meals', value: '2' },
  { label: '3 meals', value: '3' },
  { label: '4 meals', value: '4' },
  { label: '5+ meals', value: '5_plus' },
];

export default function OnboardingMealFrequency() {
  const { profile, updateDraft } = useProfile();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<MealFrequencyValues>({
    resolver: zodResolver(mealFrequencySchema),
    mode: 'onChange',
    defaultValues: { mealsPerDay: profile.mealsPerDay },
  });

  return (
    <OnboardingLayout
      step={5}
      totalSteps={5}
      title="How many meals a day?"
      subtitle="Count your main meals like breakfast, lunch, and dinner."
      tip="This helps me set up your daily plan."
      onBack={() => router.back()}
      onContinue={handleSubmit(() => router.push('/onboarding/complete'))}
      continueDisabled={!isValid}
      continueLabel="Finish"
    >
      <Controller
        control={control}
        name="mealsPerDay"
        render={({ field: { value, onChange } }) => (
          <>
            {options.map((option) => (
              <SelectableOption
                key={option.value}
                label={option.label}
                selected={value === option.value}
                onPress={() => {
                  onChange(option.value);
                  updateDraft({ mealsPerDay: option.value });
                }}
              />
            ))}
          </>
        )}
      />
    </OnboardingLayout>
  );
}
