import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeNavbar } from "../../components/home/HomeNavbar";
import { HomeWelcome } from "../../components/home/HomeWelcome";
import { StreakCalendarCard } from "../../components/home/StreakCalendarCard";
import { SugarProgressCard } from "../../components/home/SugarProgressCard";
import { ScreenContainer } from "../../components/ScreenContainer";
import { spacing } from "../../constants/theme";
import { useProfile } from "../../hooks/useProfile";
import { MOCK_STREAK_DAYS, MOCK_SUGAR_TODAY } from "../../lib/mockHome";

// Floating tab bar sizes set in app/(tabs)/_layout.tsx.
const TAB_BAR_HEIGHT = 54;
const PANDA_BUTTON_LIFT = 16;

// Light grey page background from the Home design; cards stay white.
const HOME_BACKGROUND = "#F7F7F7";

export default function HomeScreen() {
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  // The scroll area stops above the floating tab bar (and its raised Panda
  // button) so content never scrolls underneath it: bar height + its bottom
  // margin (safe area + spacing.sm) + the Panda button's lift.
  const tabBarSpace = TAB_BAR_HEIGHT + insets.bottom + spacing.sm + PANDA_BUTTON_LIFT;

  return (
    // Scrolls on smaller phones; the tab bar stays fixed below it.
    <ScreenContainer
      scroll
      edges={["top"]}
      backgroundColor={HOME_BACKGROUND}
      scrollBottomInset={tabBarSpace}
    >
      {/* Menu and notification actions are placeholders for the MVP. */}
      <HomeNavbar hasUnreadNotifications />

      <View className="mt-lg">
        <HomeWelcome name={profile.name} streakDays={MOCK_STREAK_DAYS} />
      </View>

      <View className="mt-md">
        <SugarProgressCard
          consumedGrams={MOCK_SUGAR_TODAY.consumedGrams}
          goalGrams={MOCK_SUGAR_TODAY.goalGrams}
          lowLimitGrams={MOCK_SUGAR_TODAY.lowLimitGrams}
        />
      </View>

      <View className="mt-md">
        <StreakCalendarCard />
      </View>
    </ScreenContainer>
  );
}
