import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NextBestAction } from '@/models';
import { theme } from '@/theme';
import { webPointer } from '@/utils/pressable';

export function NextBestActionCard({
  action,
  onPress,
}: {
  action: NextBestAction;
  onPress: () => void;
}) {
  const protection = action.category === 'protection';

  return (
    <View style={[styles.card, protection ? styles.protection : styles.retirement]}>
      <Text style={styles.eyebrow}>{action.eyebrow}</Text>
      <Text style={styles.title}>{action.title}</Text>
      <Text style={styles.message}>{action.message}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} style={[styles.cta, webPointer]}>
        <Text style={styles.ctaLabel}>{action.ctaLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color={theme.colors.navy} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    gap: 8,
    borderWidth: 1,
  },
  retirement: {
    backgroundColor: theme.colors.cautionSoft,
    borderColor: '#EFE4CF',
  },
  protection: {
    backgroundColor: '#F4F7FA',
    borderColor: theme.colors.line,
  },
  eyebrow: {
    ...theme.type.label,
    color: theme.colors.muted,
  },
  title: {
    ...theme.type.heading,
    color: theme.colors.ink,
  },
  message: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  cta: {
    marginTop: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
  },
  ctaLabel: {
    ...theme.type.bodyStrong,
    color: theme.colors.navy,
  },
});
