import { StyleSheet, Text } from 'react-native';
import { theme } from '@/theme';

export function IllustrativeNote({ children }: { children?: string }) {
  return (
    <Text style={styles.note}>
      {children ?? 'Illustrative figures for this prototype. Not a quotation or personal advice.'}
    </Text>
  );
}

const styles = StyleSheet.create({
  note: {
    ...theme.type.caption,
    color: theme.colors.faint,
  },
});
