import { Ionicons } from '@expo/vector-icons';
import { Ref, useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  // Helper text shown under the input while there is no error.
  hint?: string;
  // Smaller label and helper text used by the onboarding flow.
  compact?: boolean;
  ref?: Ref<TextInput>;
};

const inputClassName =
  'h-[52px] rounded-md border-[1.5px] border-border px-md text-md text-textPrimary bg-background';

const TOGGLE_WIDTH = 48;

export function TextField({ label, error, hint, compact = false, style, secureTextEntry, ref, ...inputProps }: Props) {
  // Password fields get a show/hide toggle; everything else is unchanged.
  const [isHidden, setIsHidden] = useState(true);
  const labelWeightClassName = compact ? 'font-medium' : 'font-semibold';
  const helperSizeClassName = compact ? 'text-[13px]' : 'text-sm';

  return (
    <View className="mb-md">
      <Text className={`text-sm ${labelWeightClassName} text-textPrimary mb-xs`}>{label}</Text>
      <View>
        <TextInput
          ref={ref}
          className={inputClassName}
          style={[secureTextEntry ? { paddingRight: TOGGLE_WIDTH } : undefined, style]}
          // placeholderTextColor is a prop, not a style, so it keeps the theme value.
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && isHidden}
          {...inputProps}
        />
        {secureTextEntry && (
          <Pressable
            className="absolute right-0 top-0 bottom-0 items-center justify-center active:opacity-70"
            style={{ width: TOGGLE_WIDTH }}
            onPress={() => setIsHidden((hidden) => !hidden)}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? 'Show password' : 'Hide password'}
          >
            <Ionicons name={isHidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {/* Same color, size and 8px offset as the app's previous inline error text. */}
      {error ? (
        <Text className={`${helperSizeClassName} text-danger mt-sm`}>{error}</Text>
      ) : (
        hint && <Text className={`${helperSizeClassName} text-textSecondary mt-xs`}>{hint}</Text>
      )}
    </View>
  );
}
