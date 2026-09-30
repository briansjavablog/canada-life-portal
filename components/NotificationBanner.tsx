import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import { webPointer } from '@/utils/pressable';

export function NotificationBanner({
  title,
  body,
  onPress,
  onDismiss,
}: {
  title: string;
  body: string;
  onPress: () => void;
  onDismiss: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { top: insets.top + 8 }]}>
      <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, webPointer]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.row}>
          <Text style={styles.open}>Open</Text>
          <Pressable accessibilityRole="button" onPress={onDismiss} hitSlop={8}>
            <Text style={styles.dismiss}>Dismiss</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
  },
  card: {
    backgroundColor: theme.colors.navy,
    borderRadius: theme.radius.md,
    padding: theme.space.md,
    gap: 4,
    ...theme.shadow.card,
  },
  title: {
    ...theme.type.bodyStrong,
    color: '#FFFFFF',
  },
  body: {
    ...theme.type.caption,
    color: 'rgba(255,255,255,0.82)',
  },
  row: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  open: {
    ...theme.type.bodyStrong,
    color: '#FFFFFF',
  },
  dismiss: {
    ...theme.type.caption,
    color: 'rgba(255,255,255,0.72)',
  },
});
