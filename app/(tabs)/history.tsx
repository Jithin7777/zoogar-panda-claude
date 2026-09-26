import { Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';

// Placeholder tab for the Home MVP.
export default function HistoryScreen() {
  return (
    <ScreenContainer edges={['top']}>
      <Text className="text-xl font-extrabold text-textPrimary mb-sm">History</Text>
      <Text className="text-md text-textSecondary">Coming soon.</Text>
    </ScreenContainer>
  );
}
