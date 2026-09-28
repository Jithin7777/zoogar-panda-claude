import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageTitle } from '../components/PageTitle';
import { PandaMascot } from '../components/PandaMascot';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { colors } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useOnboardingDraft } from '../hooks/useOnboardingDraft';
import { SignupValues, signupSchema } from '../lib/validation';

export default function SignUpScreen() {
  const { signup, loginWithGoogle } = useAuth();
  const { updateDraft } = useOnboardingDraft();
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitted, isSubmitting: isFormSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSignUp = async ({ name, email, password }: SignupValues) => {
    await signup(name, email, password);
    updateDraft({ name });
    router.replace('/onboarding/step-1');
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleSubmitting(true);
    await loginWithGoogle();
    setIsGoogleSubmitting(false);
    router.replace('/onboarding/step-1');
  };

  return (
    <ScreenContainer scroll backgroundColor={colors.pageBackground}>
      <View className="items-center">
        <View className="w-[88px] h-[88px] rounded-full bg-primaryLight items-center justify-center">
          <PandaMascot size={64} />
        </View>
        <View className="mt-lg">
          <PageTitle
            centered
            title="Create your account"
            subtitle="Start your healthier habits journey today."
          />
        </View>
      </View>

      <View className="mt-xl">
        <Card>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Name"
                placeholder="Your name"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => emailRef.current?.focus()}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                ref={emailRef}
                label="Email"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => passwordRef.current?.focus()}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                ref={passwordRef}
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                value={value}
                onChangeText={(password) => {
                  onChange(password);
                  // The match rule lives on confirmPassword, so re-check it when the
                  // password changes. Only after a submit, so errors still first
                  // appear on submit.
                  if (isSubmitted) trigger('confirmPassword');
                }}
                onBlur={onBlur}
                error={errors.password?.message}
                // Mirrors the min(8) rule in signupSchema.
                hint="At least 8 characters."
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                ref={confirmPasswordRef}
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <View className="mt-sm">
            <Button
              label="Sign Up"
              onPress={handleSubmit(handleSignUp)}
              loading={isFormSubmitting}
              disabled={isGoogleSubmitting}
            />
          </View>

          <View className="flex-row items-center my-md">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="text-sm text-textSecondary mx-sm">or</Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          <Button
            label="Continue with Google"
            variant="outline"
            icon="logo-google"
            onPress={handleGoogleSignUp}
            loading={isGoogleSubmitting}
            disabled={isFormSubmitting}
          />
        </Card>
      </View>

      <View className="flex-row items-center justify-center mt-lg">
        <Text className="text-sm text-textSecondary">Already have an account?</Text>
        <Pressable
          className="py-sm px-xs active:opacity-70"
          hitSlop={8}
          onPress={() => router.replace('/login')}
          accessibilityRole="link"
        >
          <Text className="text-sm font-bold text-primaryDark">Login</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
