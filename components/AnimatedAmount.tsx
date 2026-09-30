import { StyleSheet, Text } from 'react-native';
import { theme } from '@/theme';
import { useTweenNumber } from '@/hooks/useTweenNumber';

export function AnimatedAmount({
  value,
  format,
  style,
}: {
  value: number;
  format: (value: number) => string;
  style?: object;
}) {
  const tweened = useTweenNumber(value);
  return <Text style={[styles.amount, style]}>{format(tweened)}</Text>;
}

const styles = StyleSheet.create({
  amount: {
    ...theme.type.display,
    color: theme.colors.ink,
  },
});
