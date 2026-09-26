import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type Props = {
  hasUnreadNotifications?: boolean;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
};

// Left and right slots share the same width so the logo stays truly centered.
const iconButtonClassName = 'w-[24px] h-[44px] items-center justify-center active:opacity-70';

export function HomeNavbar({ hasUnreadNotifications = false, onMenuPress, onNotificationsPress }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        className={iconButtonClassName}
        onPress={onMenuPress}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        <Ionicons name="menu" size={24} color={colors.textPrimary} />
      </Pressable>

      <View className="flex-1 flex-row items-start justify-center">
        <Text className="text-lg font-bold text-textPrimary">
          Zoogar <Text className="text-primary">Panda</Text>
        </Text>
        <Ionicons name="leaf" size={14} color={colors.primary} />
      </View>

      <Pressable
        className={iconButtonClassName}
        onPress={onNotificationsPress}
        accessibilityRole="button"
        accessibilityLabel={hasUnreadNotifications ? 'Notifications, unread' : 'Notifications'}
      >
        <Ionicons name="notifications-outline" size={26} color={colors.textPrimary} />
        {hasUnreadNotifications && (
          <View className="absolute top-[8px] right-[8px] w-[10px] h-[10px] rounded-full bg-primary border-2 border-background" />
        )}
      </Pressable>
    </View>
  );
}
