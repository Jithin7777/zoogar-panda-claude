import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resetAppData } from '../lib/resetAppData';

// Testing helper only. Hidden automatically in production builds via __DEV__.
export function DevResetButton() {
  const insets = useSafeAreaInsets();

  if (!__DEV__) return null;

  const handleReset = async () => {
    await resetAppData();
    router.replace('/');
  };

  return (
    // Centered just below the status bar so it never covers header actions
    // (e.g. the Home notification bell). The wrapper passes touches through.
    <View
      className="absolute left-0 right-0 items-center z-[999] pointer-events-box-none"
      // Safe-area inset is only known at runtime, so the offset stays inline.
      style={{ top: insets.top }}
    >
      <Pressable className="bg-danger px-md py-xs rounded-full opacity-90" onPress={handleReset}>
        <Text className="text-white text-sm font-bold">Reset App Data</Text>
      </Pressable>
    </View>
  );
}
