import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { colors, fontSize, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

export default function SignUpScreen() {
  const { signup, loginWithGoogle } = useAuth();
  const { updateDraft } = useProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = name.length > 0 && email.length > 0 && passwordsMatch;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    await signup(name, email, password);
    updateDraft({ name });
    setIsSubmitting(false);
    router.replace('/onboarding/step-1');
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    setIsSubmitting(false);
    router.replace('/onboarding/step-1');
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Start your healthier habits journey today.</Text>

      <View style={styles.form}>
        <TextField label="Name" placeholder="Your name" value={name} onChangeText={setName} />
        <TextField
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextField
          label="Confirm Password"
          placeholder="Re-enter your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {password.length > 0 && confirmPassword.length > 0 && !passwordsMatch && (
          <Text style={styles.error}>Passwords do not match.</Text>
        )}
      </View>

      <Button label="Sign Up" onPress={handleSignUp} loading={isSubmitting} disabled={!canSubmit} />
      <Button
        label="Continue with Google"
        variant="outline"
        onPress={handleGoogleSignUp}
        style={styles.googleButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Text style={styles.footerLink} onPress={() => router.replace('/login')}>
          Login
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.lg,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  googleButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  footerLink: {
    color: colors.primaryDark,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
