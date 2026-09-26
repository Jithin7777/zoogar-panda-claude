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
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { LoginValues, loginSchema } from '../lib/validation';

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const { profile } = useProfile();
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const goToNextScreen = () => {
    router.replace(profile.onboardingCompleted ? '/home' : '/onboarding/step-1');
  };

  const handleLogin = async ({ email, password }: LoginValues) => {
    await login(email, password);
    goToNextScreen();
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    await loginWithGoogle();
    setIsGoogleSubmitting(false);
    goToNextScreen();
  };

  return (
    <ScreenContainer scroll backgroundColor={colors.pageBackground}>
      <View className="items-center">
        <View className="w-[88px] h-[88px] rounded-full bg-primaryLight items-center justify-center">
          <PandaMascot size={64} />
        </View>
        <View className="mt-lg">
          <PageTitle centered title="Welcome back" subtitle="Log in to continue your progress." />
        </View>
      </View>

      <View className="mt-xl">
        <Card>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
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
                placeholder="Your password"
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="done"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <View className="mt-sm">
            <Button
              label="Login"
              onPress={handleSubmit(handleLogin)}
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
            onPress={handleGoogleLogin}
            loading={isGoogleSubmitting}
            disabled={isFormSubmitting}
          />
        </Card>
      </View>

      <View className="flex-row items-center justify-center mt-lg">
        <Text className="text-sm text-textSecondary">Don't have an account?</Text>
        <Pressable
          className="py-sm px-xs active:opacity-70"
          hitSlop={8}
          onPress={() => router.replace('/signup')}
          accessibilityRole="link"
        >
          <Text className="text-sm font-bold text-primaryDark">Sign Up</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
