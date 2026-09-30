import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';
import { Button } from '@/components/Button';

export function LoadingState({ label = 'Loading your policies' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={theme.colors.navy} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
  onUseMock,
}: {
  message: string;
  onRetry: () => void;
  onUseMock?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>We couldn’t load this just now</Text>
      <Text style={styles.message}>{message}</Text>
      <Button label="Try again" onPress={onRetry} />
      {onUseMock ? <Button label="Continue with demo data" onPress={onUseMock} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: theme.space.xxl,
    gap: theme.space.md,
  },
  label: {
    ...theme.type.body,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  title: {
    ...theme.type.heading,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  message: {
    ...theme.type.body,
    color: theme.colors.muted,
    textAlign: 'center',
  },
});
