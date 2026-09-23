import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectableOption } from '../../components/SelectableOption';
import { TextField } from '../../components/TextField';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useProfile } from '../../context/ProfileContext';
import { ActivityLevel, Gender } from '../../types/user';

const genderOptions: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

const activityOptions: { label: string; value: ActivityLevel }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
];

export default function OnboardingStepTwo() {
  const { profile, updateDraft } = useProfile();

  return (
    <OnboardingLayout
      step={2}
      totalSteps={4}
      title="A little about you"
      onBack={() => router.back()}
      onContinue={() => router.push('/onboarding/step-3')}
    >
      <Text style={styles.sectionLabel}>Gender (optional)</Text>
      <View style={styles.optionsWrap}>
        {genderOptions.map((option) => (
          <SelectableOption
            key={option.value}
            label={option.label}
            selected={profile.gender === option.value}
            onPress={() => updateDraft({ gender: option.value })}
          />
        ))}
      </View>

      <TextField
        label="Height in cm (optional)"
        placeholder="e.g. 170"
        keyboardType="number-pad"
        value={profile.height ?? ''}
        onChangeText={(height) => updateDraft({ height })}
      />
      <TextField
        label="Weight in kg (optional)"
        placeholder="e.g. 65"
        keyboardType="number-pad"
        value={profile.weight ?? ''}
        onChangeText={(weight) => updateDraft({ weight })}
      />

      <Text style={styles.sectionLabel}>Activity level</Text>
      <View style={styles.optionsWrap}>
        {activityOptions.map((option) => (
          <SelectableOption
            key={option.value}
            label={option.label}
            selected={profile.activityLevel === option.value}
            onPress={() => updateDraft({ activityLevel: option.value })}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  optionsWrap: {
    marginBottom: spacing.md,
  },
});
