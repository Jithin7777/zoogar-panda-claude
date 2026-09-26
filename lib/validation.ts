import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .pipe(z.email('Please enter a valid email address.'));

// Optional numeric text field: empty is allowed, otherwise a positive whole number.
const optionalPositiveWholeNumber = z
  .string()
  .trim()
  .refine((value) => value === '' || (/^\d+$/.test(value) && Number(value) > 0), {
    error: 'Please enter a positive whole number.',
  })
  .optional();

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required.'),
    email,
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const stepOneSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  age: z
    .string()
    .trim()
    .min(1, 'Age is required.')
    .regex(/^\d+$/, 'Please enter your age as a number.'),
});

export const stepTwoSchema = z.object({
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  height: optionalPositiveWholeNumber,
  weight: optionalPositiveWholeNumber,
  activityLevel: z.enum(['low', 'moderate', 'high']).optional(),
});

export const stepThreeSchema = z.object({
  sugarConsumptionFrequency: z.enum(['rarely', 'sometimes', 'daily', 'several_times_daily'], {
    error: 'Please select an option.',
  }),
});

export const stepFourSchema = z.object({
  goal: z.enum(['reduce_sugar', 'maintain_habits', 'build_healthier_habits'], {
    error: 'Please select your main goal.',
  }),
});

export const mealFrequencySchema = z.object({
  mealsPerDay: z.enum(['1', '2', '3', '4', '5_plus'], {
    error: 'Please select an option.',
  }),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type StepThreeValues = z.infer<typeof stepThreeSchema>;
export type StepFourValues = z.infer<typeof stepFourSchema>;
export type MealFrequencyValues = z.infer<typeof mealFrequencySchema>;
