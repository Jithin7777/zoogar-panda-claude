import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { shadow } from '../constants/theme';

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

const cardClassName = 'bg-background rounded-lg border border-border p-lg';

export function Card({ children, style }: Props) {
  return (
    <View className={cardClassName} style={[styles.shadow, style]}>
      {children}
    </View>
  );
}

// Kept as a StyleSheet style so the platform-specific shadow props
// (iOS shadow* and Android elevation) are preserved exactly.
const styles = StyleSheet.create({
  shadow: {
    ...shadow.soft,
  },
});
