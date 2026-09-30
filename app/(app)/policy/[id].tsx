import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AreaChart } from '@/components/AreaChart';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IllustrativeNote } from '@/components/IllustrativeNote';
import { PerformancePill } from '@/components/PolicyCard';
import { SegmentedControl } from '@/components/SegmentedControl';
import { StackHeader } from '@/components/StackHeader';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal } from '@/context/PortalContext';
import type { ChartRange } from '@/models';
import { theme } from '@/theme';
import { formatDate, formatEuro, formatPercent } from '@/utils/format';
import { seriesChange, sliceHistory } from '@/utils/history';
import { webPointer } from '@/utils/pressable';

const RANGES: { value: ChartRange; label: string }[] = [
  { value: '1Y', label: '1Y' },
  { value: '3Y', label: '3Y' },
  { value: '5Y', label: '5Y' },
  { value: 'MAX', label: 'MAX' },
];

type Section = 'performance' | 'contributions' | 'information' | 'documents';

export default function PolicyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const portal = usePortal();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<ChartRange>('1Y');
  const [section, setSection] = useState<Section>('performance');
  const [openDocument, setOpenDocument] = useState<string | null>(null);
  const policy = portal.policies.find((item) => item.id === id);

  const history = useMemo(() => (policy ? sliceHistory(policy.history, range) : []), [policy, range]);
  const change = seriesChange(history);

  if (portal.status === 'loading' || portal.status === 'idle') {
    return (
      <View style={styles.root}>
        <StackHeader title="Policy" />
        <LoadingState />
      </View>
    );
  }

  if (!policy) {
    return (
      <View style={styles.root}>
        <StackHeader title="Policy" />
        <View style={styles.pad}>
          <ErrorState message="That policy is not on this account." onRetry={() => router.back()} />
        </View>
      </View>
    );
  }

  const labels = [
    { index: 0, text: history[0] ? formatDate(history[0].date).replace(/ \d{4}$/, '') : '' },
    { index: history.length - 1, text: 'Now' },
  ];

  return (
    <View style={styles.root}>
      <StackHeader title={policy.productName} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.value}>{formatEuro(policy.currentValue)}</Text>
        <Text style={styles.number}>{policy.policyNumber}</Text>
        <View style={styles.stats}>
          {policy.monthlyContribution != null ? (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Monthly contribution</Text>
              <Text style={styles.statValue}>{formatEuro(policy.monthlyContribution)}</Text>
            </View>
          ) : null}
          <View style={styles.stat}>
            <Text style={styles.statLabel}>This year</Text>
            <PerformancePill value={policy.performanceYtd} />
          </View>
        </View>

        <Card>
          <SegmentedControl options={RANGES} value={range} onChange={setRange} />
          <AreaChart
            height={220}
            labels={labels}
            series={[{ id: 'history', values: history.map((point) => point.value), color: theme.colors.navy, fill: true }]}
          />
          <Text style={styles.rangeChange}>
            {formatEuro(change.amount)} · {formatPercent(change.ratio)} over this range
          </Text>
        </Card>

        <SegmentedControl
          fill
          options={[
            { value: 'performance', label: 'Performance' },
            { value: 'contributions', label: 'Contributions' },
            { value: 'information', label: 'Details' },
            { value: 'documents', label: 'Documents' },
          ]}
          value={section}
          onChange={setSection}
        />

        {section === 'performance' ? (
          <Card>
            <Text style={styles.sectionTitle}>{policy.fundName}</Text>
            <Text style={styles.body}>
              Annual management charge {(policy.annualManagementCharge * 100).toFixed(2)}%. Fund names are illustrative.
            </Text>
            <View style={styles.alloc}>
              {policy.allocation.map((item) => (
                <View key={item.name} style={styles.allocRow}>
                  <View style={styles.allocCopy}>
                    <Text style={styles.bodyStrong}>{item.name}</Text>
                    <Text style={styles.caption}>{(item.weight * 100).toFixed(0)}%</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${item.weight * 100}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        {section === 'contributions' ? (
          <Card>
            {policy.contributionNote ? <Text style={styles.body}>{policy.contributionNote}</Text> : null}
            {policy.monthlyContribution != null ? (
              <Text style={styles.body}>
                At the current rate, contributions this year would be {formatEuro(policy.monthlyContribution * 12)}.
              </Text>
            ) : (
              <Text style={styles.body}>This policy was funded with a single premium.</Text>
            )}
            {policy.contributions.map((entry) => (
              <View key={entry.id} style={styles.docRow}>
                <View>
                  <Text style={styles.bodyStrong}>{entry.label}</Text>
                  <Text style={styles.caption}>{formatDate(entry.date)}</Text>
                </View>
                <Text style={styles.bodyStrong}>{formatEuro(entry.amount)}</Text>
              </View>
            ))}
          </Card>
        ) : null}

        {section === 'information' ? (
          <Card>
            <Info label="Status" value={policy.status} />
            <Info label="Opened" value={formatDate(policy.openedOn)} />
            <Info label="Policy number" value={policy.policyNumber} />
            <Info label="Product" value={policy.productName} />
            <Text style={styles.body}>{policy.summary}</Text>
          </Card>
        ) : null}

        {section === 'documents' ? (
          <Card>
            {policy.documents.map((document) => (
              <Pressable
                key={document.id}
                accessibilityRole="button"
                onPress={() => setOpenDocument((current) => (current === document.id ? null : document.id))}
                style={[styles.docBlock, webPointer]}
              >
                <Text style={styles.bodyStrong}>{document.title}</Text>
                <Text style={styles.caption}>{formatDate(document.date)}</Text>
                {openDocument === document.id ? <Text style={styles.body}>{document.detail}</Text> : null}
              </Pressable>
            ))}
          </Card>
        ) : null}

        {policy.supportsProjection ? (
          <Button label="Explore retirement projection" onPress={() => router.push('/projection')} />
        ) : (
          <IllustrativeNote>Retirement projection is available on the Retirement Plan.</IllustrativeNote>
        )}
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.caption}>{label}</Text>
      <Text style={styles.bodyStrong}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pad: {
    padding: theme.space.lg,
  },
  content: {
    paddingHorizontal: theme.space.lg,
    gap: theme.space.lg,
  },
  value: {
    fontFamily: 'SourceSerif4_600SemiBold',
    fontSize: 40,
    lineHeight: 46,
    color: theme.colors.navy,
  },
  number: {
    ...theme.type.caption,
    color: theme.colors.faint,
    marginTop: -8,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.space.lg,
  },
  stat: {
    gap: 6,
  },
  statLabel: {
    ...theme.type.caption,
    color: theme.colors.muted,
  },
  statValue: {
    ...theme.type.heading,
    color: theme.colors.ink,
  },
  rangeChange: {
    ...theme.type.caption,
    color: theme.colors.muted,
  },
  sectionTitle: {
    ...theme.type.heading,
    color: theme.colors.ink,
  },
  body: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  bodyStrong: {
    ...theme.type.bodyStrong,
    color: theme.colors.ink,
  },
  caption: {
    ...theme.type.caption,
    color: theme.colors.faint,
  },
  alloc: {
    gap: 12,
    marginTop: 4,
  },
  allocRow: {
    gap: 6,
  },
  allocCopy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    borderRadius: 99,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    backgroundColor: theme.colors.navy,
    borderRadius: 99,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  docBlock: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    gap: 4,
  },
  info: {
    paddingVertical: 8,
    gap: 2,
  },
});
