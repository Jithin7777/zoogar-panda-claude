import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

type Props = {
  label: string;
  // Optional short explanation shown under the label.
  description?: string;
  selected: boolean;
  onPress: () => void;
};

const optionClassName =
  'flex-row items-center justify-between border-[1.5px] rounded-md py-[12px] px-lg mb-sm';

// Selected and unselected classes are mutually exclusive so no two classes
// ever compete for the same property.
const optionStateClassName = {
  selected: 'border-primary bg-primaryLight',
  unselected: 'border-border bg-background',
};

const labelStateClassName = {
  selected: 'text-primaryDark font-semibold',
  unselected: 'text-textPrimary font-medium',
};

export function SelectableOption({ label, description, selected, onPress }: Props) {
  const state = selected ? 'selected' : 'unselected';

  return (
    <Pressable onPress={onPress} className={`${optionClassName} ${optionStateClassName[state]}`}>
      <View className="flex-1 mr-sm">
        <Text className={`text-[15px] ${labelStateClassName[state]}`}>{label}</Text>
        {description && <Text className="text-[13px] text-textSecondary mt-xs">{description}</Text>}
      </View>
      {/* Both icons share the same 22px glyph box, so selecting never shifts the label. */}
      {selected ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      ) : (
        <Ionicons name="ellipse-outline" size={22} color={colors.textSecondary} />
      )}
    </Pressable>
  );
}
