import { Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  // 'compact' and 'celebration' are the smaller type scale used by the onboarding flow.
  size?: Size;
};

type Size = 'default' | 'compact' | 'celebration';

const titleSizeClassName: Record<Size, string> = {
  default: 'text-xl',
  compact: 'text-[22px] leading-[28px]',
  // Slightly larger so the Complete screen title balances its big panda.
  celebration: 'text-[24px] leading-[30px]',
};

const subtitleSizeClassName: Record<Size, string> = {
  default: 'text-md',
  compact: 'text-[15px] leading-[22px]',
  celebration: 'text-[15px] leading-[22px]',
};

// Shared page heading for the auth and onboarding screens, sized to sit
// alongside the Home screen's type scale. Callers own the outer spacing.
export function PageTitle({ title, subtitle, centered = false, size = 'default' }: Props) {
  const alignClassName = centered ? 'text-center' : '';

  return (
    <View>
      <Text className={`${titleSizeClassName[size]} font-bold text-textPrimary ${alignClassName}`}>{title}</Text>
      {subtitle && (
        <Text className={`${subtitleSizeClassName[size]} text-textSecondary mt-sm ${alignClassName}`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
