import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../constants/theme";
import { Card } from "../Card";
import { Panda3D } from "../Panda3D";

type Props = {
  name?: string;
  streakDays?: number;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export function HomeWelcome({ name, streakDays }: Props) {
  const trimmedName = name?.trim();

  return (
    <View className="flex-row items-center">
      {/* Left column: 45% width */}
      <View className="flex-[0.45] pr-sm">
        <Text className="text-md font-semibold  text-textPrimary ">
          {getGreeting()}
          {trimmedName ? "," : "!"}
        </Text>

        {trimmedName && (
          <Text className="text-xl font-bold text-primary">
            {trimmedName}! 👋
          </Text>
        )}

        <Text className="text-xs text-textSecondary mt-sm">
          Small choices today,{"\n"}better health tomorrow.
        </Text>

        {streakDays !== undefined && (
          <Card style={styles.streakCard}>
            <View className="flex-row items-center">
              <View className="w-[44px] h-[44px] rounded-full bg-primaryLight items-center justify-center mr-sm">
                <Ionicons name="flame" size={26} color={colors.primary} />
              </View>

              <View>
                <Text className="text-md font-extrabold text-primaryDark">
                  {streakDays}
                </Text>

                <Text className="text-xs font-semibold text-textPrimary">
                  Day Streak
                </Text>

                <Text className="text-xs font-semibold text-primary">
                  Keep it up!
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>

      {/* Right column: 55% width. self-stretch makes it exactly as tall as the
          welcome content, so the panda is sized and centered against it. */}
      <View className="flex-[0.55] self-stretch">
        <Panda3D />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    alignSelf: "flex-start",
    padding: 10,
    marginTop: spacing.md,
    borderRadius: 12,
  },
});
