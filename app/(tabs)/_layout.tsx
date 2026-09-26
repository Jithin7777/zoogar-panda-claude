import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PandaMascot } from '../../components/PandaMascot';
import { colors, radius, shadow, spacing } from '../../constants/theme';

const TAB_BAR_HEIGHT = 54;
const PANDA_BUTTON_SIZE = 60;
// How far the Panda button rises above the top edge of the tab bar.
const PANDA_BUTTON_LIFT = 16;

// The floating tab bar leaves a gap around it; match it to the screens' white
// background instead of the navigator's default light grey.
const tabsTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background },
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <ThemeProvider value={tabsTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryDark,
          
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelPosition: 'below-icon',
          // Floating rounded bar, inset to line up with the Home cards.
          tabBarStyle: {
            // Float over the screen content so no separate area shows behind the bar.
            position: 'absolute',
            height: TAB_BAR_HEIGHT,
            marginHorizontal: spacing.lg,
            marginBottom: insets.bottom + spacing.sm,
            paddingTop: 0,
            paddingBottom: 0,
            borderRadius: radius.md,
            borderTopWidth: 0,
            backgroundColor: colors.background,
            ...shadow.soft,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 2 },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'time' : 'time-outline'} size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="panda"
          options={{
            title: 'Panda',
            // Raised circular button with no label, as in the design.
            tabBarLabel: () => null,
            tabBarAccessibilityLabel: 'Panda',
            tabBarIconStyle: {
              width: PANDA_BUTTON_SIZE,
              height: PANDA_BUTTON_SIZE,
              marginTop: -(PANDA_BUTTON_LIFT + 11),
            },
            tabBarIcon: () => (
              <View
                className="rounded-full bg-primary items-center justify-center border-[3px] border-background"
                style={{ width: PANDA_BUTTON_SIZE, height: PANDA_BUTTON_SIZE, ...shadow.soft }}
              >
                <PandaMascot size={35} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
