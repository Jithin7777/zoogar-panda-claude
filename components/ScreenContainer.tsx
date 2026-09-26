import { PropsWithChildren } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  // Tab screens pass ['top'] because the tab bar already handles the bottom inset.
  edges?: Edge[];
  // Overrides the default white screen background (the whole screen, including safe areas).
  backgroundColor?: string;
  // Space to leave free below the ScrollView (e.g. for a floating tab bar), so
  // content is clipped above it instead of scrolling underneath. Scroll mode only.
  scrollBottomInset?: number;
}>;

const contentClassName = 'grow px-lg pt-lg pb-xl';

export function ScreenContainer({
  children,
  scroll = false,
  style,
  edges = ['top', 'bottom'],
  backgroundColor,
  scrollBottomInset,
}: Props) {
  const Wrapper = scroll ? ScrollView : View;
  const wrapperProps = scroll
    ? {
        contentContainerClassName: contentClassName,
        contentContainerStyle: style,
        style: scrollBottomInset ? { marginBottom: scrollBottomInset } : undefined,
        keyboardShouldPersistTaps: 'handled' as const,
      }
    : { className: contentClassName, style };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      style={backgroundColor ? { backgroundColor } : undefined}
      edges={edges}
    >
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </SafeAreaView>
  );
}
