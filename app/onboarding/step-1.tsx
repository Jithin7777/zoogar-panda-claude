import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native';
import { Card } from '../../components/Card';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { TextField } from '../../components/TextField';
import { spacing } from '../../constants/theme';
import { useOnboardingDraft } from '../../hooks/useOnboardingDraft';
import { stepOneSchema } from '../../lib/validation';

export default function OnboardingStepOne() {
  const { draft, updateDraft } = useOnboardingDraft();
  const ageRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(stepOneSchema),
    mode: 'onChange',
    defaultValues: { name: draft.name, age: draft.age },
  });

  return (
    <OnboardingLayout
      step={1}
      totalSteps={5}
      title="Let's get to know you"
      subtitle="Tell us a little about yourself so we can personalize your plan."
      tip="This helps me get to know you better."
      onContinue={handleSubmit(() => router.push('/onboarding/step-2'))}
      continueDisabled={!isValid}
    >
      {/* The last field's mb-md already adds space at the bottom, so trim the
          card's bottom padding to keep it visually even. */}
      <Card style={{ paddingBottom: spacing.sm }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              compact
              label="Name"
              placeholder="Your name"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => ageRef.current?.focus()}
              value={value}
              onChangeText={(name) => {
                onChange(name);
                updateDraft({ name });
              }}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="age"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              compact
              ref={ageRef}
              label="Age"
              placeholder="Your age"
              keyboardType="number-pad"
              returnKeyType="done"
              value={value}
              onChangeText={(age) => {
                onChange(age);
                updateDraft({ age });
              }}
              onBlur={onBlur}
              error={errors.age?.message}
            />
          )}
        />
      </Card>
    </OnboardingLayout>
  );
}
