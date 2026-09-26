import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { colors, spacing } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  // Optional Ionicons glyph shown before the label.
  icon?: ComponentProps<typeof Ionicons>['name'];
};

const baseClassName = 'h-[56px] rounded-lg flex-row items-center justify-center px-lg';

const variantClassName: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-primaryLight',
  outline: 'bg-background border-[1.5px] border-border',
};

const textVariantClassName: Record<Variant, string> = {
  primary: 'text-textOnPrimary',
  secondary: 'text-primaryDark',
  outline: 'text-textPrimary',
};

// Icons take a color prop rather than a class, so mirror the label colors.
const iconVariantColor: Record<Variant, string> = {
  primary: colors.textOnPrimary,
  secondary: colors.primaryDark,
  outline: colors.textPrimary,
};

// Matches the original inline logic: only "primary" gets the on-primary
// color, every other variant uses the plain primary color.
const indicatorVariantClassName: Record<Variant, string> = {
  primary: 'text-textOnPrimary',
  secondary: 'text-primary',
  outline: 'text-primary',
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, style, icon }: Props) {
  const isDisabled = disabled || loading;

  const pressableClassName = [
    baseClassName,
    variantClassName[variant],
    isDisabled ? 'opacity-50' : 'active:opacity-[0.85]',
  ].join(' ');

  return (
    <Pressable onPress={onPress} disabled={isDisabled} className={pressableClassName} style={style}>
      {loading ? (
        <ActivityIndicator className={indicatorVariantClassName[variant]} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={iconVariantColor[variant]} style={{ marginRight: spacing.sm }} />}
          <Text className={`text-md font-semibold ${textVariantClassName[variant]}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
