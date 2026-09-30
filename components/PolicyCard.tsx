import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { formatEuro, formatPercent } from '@/utils/format';
import { webPointer } from '@/utils/pressable';
import { AreaChart } from '@/components/AreaChart';
import type { Policy } from '@/models';

export function PerformancePill({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <View style={[styles.pill, positive ? styles.positive : styles.negative]}>
      <Ionicons name={positive ? 'arrow-up' : 'arrow-down'} size={12} color={positive ? theme.colors.positive : theme.colors.negative} />
      <Text style={[styles.pillText, { color: positive ? theme.colors.positive : theme.colors.negative }]}>
        {formatPercent(value)}
      </Text>
    </View>
  );
}

export function PolicyCard({
  policy,
  onPress,
  showSummary = true,
}: {
  policy: Policy;
  onPress: () => void;
  showSummary?: boolean;
}) {
  const values = policy.history.slice(-18).map((point) => point.value);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, webPointer]}>
      <View style={styles.top}>
        <View style={styles.copy}>
          <Text style={styles.name}>{policy.productName}</Text>
          <Text style={styles.meta}>{policy.policyNumber}</Text>
          <Text style={styles.value}>{formatEuro(policy.currentValue)}</Text>
          <PerformancePill value={policy.performanceYtd} />
        </View>
        <View style={styles.chart}>
          <AreaChart
            compact
            height={72}
            series={[{ id: policy.id, values, color: theme.colors.navy, fill: true }]}
          />
        </View>
      </View>
      {showSummary ? <Text style={styles.summary}>{policy.summary}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.space.lg,
    gap: theme.space.md,
    ...theme.shadow.card,
  },
  pressed: {
    opacity: 0.92,
  },
  top: {
    flexDirection: 'row',
    gap: theme.space.md,
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  chart: {
    width: 112,
  },
  name: {
    ...theme.type.bodyStrong,
    color: theme.colors.ink,
    fontSize: 18,
  },
  meta: {
    ...theme.type.caption,
    color: theme.colors.faint,
  },
  value: {
    fontFamily: 'SourceSerif4_600SemiBold',
    fontSize: 26,
    lineHeight: 32,
    color: theme.colors.navy,
    marginTop: 4,
  },
  summary: {
    ...theme.type.caption,
    color: theme.colors.muted,
  },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    marginTop: 4,
  },
  positive: {
    backgroundColor: theme.colors.positiveSoft,
  },
  negative: {
    backgroundColor: theme.colors.negativeSoft,
  },
  pillText: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 13,
  },
});
