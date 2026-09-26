import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { Card } from '../../components/Card';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { TextField } from '../../components/TextField';
import { spacing } from '../../constants/theme';
import { useProfile } from '../../context/ProfileContext';
import { stepTwoSchema } from '../../lib/validation';
import { ActivityLevel, Gender } from '../../types/user';

const genderOptions: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

const activityOptions: { label: string; description: string; value: ActivityLevel }[] = [
  { label: 'Low', description: 'Mostly sitting or little exercise', value: 'low' },
  { label: 'Moderate', description: 'Some regular exercise', value: 'moderate' },
  { label: 'High', description: 'Very active most days', value: 'high' },
];

// Each card's last child already adds space below itself (options mb-sm,
// fields mb-md), so trim the card's bottom padding to keep it visually even.
const optionsCardStyle = { paddingBottom: spacing.md };
const fieldsCardStyle = { paddingBottom: spacing.sm };

const cardTitleClassName = 'text-md font-bold text-textPrimary mb-md';

export default function OnboardingStepTwo() {
  const { profile, updateDraft } = useProfile();
  const weightRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(stepTwoSchema),
    mode: 'onChange',
    defaultValues: {
      gender: profile.gender,
      height: profile.height ?? '',
      weight: profile.weight ?? '',
      activityLevel: profile.activityLevel,
    },
  });

  return (
    <OnboardingLayout
      step={2}
      totalSteps={5}
      title="A little about you"
      subtitle="All optional — it helps us personalise your goal."
      tip="You can update these later in Profile."
      onBack={() => router.back()}
      onContinue={handleSubmit(() => router.push('/onboarding/step-3'))}
      continueDisabled={!isValid}
    >
      <Card style={optionsCardStyle}>
        <Text className={cardTitleClassName}>Gender (optional)</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { value, onChange } }) => (
            <>
              {genderOptions.map((option) => (
                <SelectableOption
                  key={option.value}
                  label={option.label}
                  selected={value === option.value}
                  onPress={() => {
                    onChange(option.value);
                    updateDraft({ gender: option.value });
                  }}
                />
              ))}
            </>
          )}
        />
      </Card>

      <View className="mt-lg">
        <Card style={fieldsCardStyle}>
          <Text className={cardTitleClassName}>Body information (optional)</Text>
          <View className="flex-row gap-md">
            <View className="flex-1">
              <Controller
                control={control}
                name="height"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    compact
                    label="Height (cm)"
                    placeholder="e.g. 170"
                    keyboardType="number-pad"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => weightRef.current?.focus()}
                    value={value}
                    onChangeText={(height) => {
                      onChange(height);
                      updateDraft({ height });
                    }}
                    onBlur={onBlur}
                    error={errors.height?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="weight"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    compact
                    ref={weightRef}
                    label="Weight (kg)"
                    placeholder="e.g. 65"
                    keyboardType="number-pad"
                    returnKeyType="done"
                    value={value}
                    onChangeText={(weight) => {
                      onChange(weight);
                      updateDraft({ weight });
                    }}
                    onBlur={onBlur}
                    error={errors.weight?.message}
                  />
                )}
              />
            </View>
          </View>
        </Card>
      </View>

      <View className="mt-lg">
        <Card style={optionsCardStyle}>
          <Text className={cardTitleClassName}>Activity level</Text>
          <Controller
            control={control}
            name="activityLevel"
            render={({ field: { value, onChange } }) => (
              <>
                {activityOptions.map((option) => (
                  <SelectableOption
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    selected={value === option.value}
                    onPress={() => {
                      onChange(option.value);
                      updateDraft({ activityLevel: option.value });
                    }}
                  />
                ))}
              </>
            )}
          />
        </Card>
      </View>
    </OnboardingLayout>
  );
}
