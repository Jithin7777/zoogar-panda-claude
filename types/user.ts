export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ActivityLevel = 'low' | 'moderate' | 'high';

export type SugarFrequency = 'rarely' | 'sometimes' | 'daily' | 'several_times_daily';

export type Goal = 'reduce_sugar' | 'maintain_habits' | 'build_healthier_habits';

export interface UserProfile {
  name: string;
  age: string;
  gender?: Gender;
  height?: string;
  weight?: string;
  activityLevel?: ActivityLevel;
  sugarConsumptionFrequency?: SugarFrequency;
  goal?: Goal;
  onboardingCompleted: boolean;
}

export const emptyProfile: UserProfile = {
  name: '',
  age: '',
  onboardingCompleted: false,
};
