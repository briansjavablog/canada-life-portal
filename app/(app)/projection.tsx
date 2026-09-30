import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedAmount } from '@/components/AnimatedAmount';
import { AreaChart } from '@/components/AreaChart';
import { Card, Eyebrow } from '@/components/Card';
import { IllustrativeNote } from '@/components/IllustrativeNote';
import { StackHeader } from '@/components/StackHeader';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal, useScenario } from '@/context/PortalContext';
import type { Projection } from '@/models';
import { theme } from '@/theme';
import { formatEuro, formatGrowthRate } from '@/utils/format';
import { webPointer } from '@/utils/pressable';

const MIN = 500;
const MAX = 1000;
const STEP = 50;
const PRESETS = [500, 600, 700, 800, 1000];

function snap(value: number) {
  return Math.min(MAX, Math.max(MIN, Math.round(value / STEP) * STEP));
}

export default function ProjectionScreen() {
  const params = useLocalSearchParams<{ monthly?: string }>();
  const portal = usePortal();
  const scenario = useScenario();
  const insets = useSafeAreaInsets();
  const retirement = portal.policies.find((policy) => policy.supportsProjection);
  const currentContribution = retirement?.monthlyContribution ?? MIN;
  const [contribution, setContribution] = useState(currentContribution);
  const [selected, setSelected] = useState<Projection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const monthly = Number(params.monthly);
    if (Number.isFinite(monthly)) {
      setContribution(snap(monthly));
    }
  }, [params.monthly]);

  const customer = portal.customer;
  const project = portal.project;

  useEffect(() => {
    if (!customer || !retirement) return;
    let cancelled = false;
    project({
      currentValue: retirement.currentValue,
      monthlyContribution: contribution,
      currentAge: customer.age,
      retirementAge: customer.retirementAge,
      annualGrowthRate: scenario.annualGrowthRate,
    })
      .then((result) => {
        if (!cancelled) {
          setSelected(result);
          setError(null);
        }
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : 'Projection could not be updated.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [contribution, customer, project, retirement, scenario.annualGrowthRate]);

  if (portal.status === 'loading' || portal.status === 'idle') {
    return (
      <View style={styles.root}>
        <StackHeader title="Projection" />
        <LoadingState label="Preparing your projection" />
      </View>
    );
  }

  if (!portal.customer || !retirement || !portal.retirementProjection) {
    return (
      <View style={styles.root}>
        <StackHeader title="Projection" />
        <View style={styles.pad}>
          <ErrorState message={portal.error ?? 'A retirement plan is needed for this projection.'} onRetry={portal.reload} />
        </View>
      </View>
    );
  }

  const baseline = portal.retirementProjection;
  const projected = selected ?? baseline;
  const delta = projected.projectedValue - baseline.projectedValue;
  const changed = contribution !== currentContribution;
  const ages = projected.points;
  const labels = ages
    .map((point, index) => ({ index, text: String(point.age) }))
    .filter((item) => item.text.endsWith('0') || item.text.endsWith('5') || item.index === 0 || item.index === ages.length - 1);

  return (
    <View style={styles.root}>
      <StackHeader title="Retirement projection" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Eyebrow>Illustrative projection</Eyebrow>
        <Text style={styles.title}>Your retirement at {portal.customer.retirementAge}</Text>
        <AnimatedAmount value={projected.projectedValue} format={formatEuro} style={styles.hero} />
        <Text style={styles.sub}>
          From {formatEuro(retirement.currentValue)} today, contributing {formatEuro(contribution)} a month.
        </Text>

        {changed ? (
          <View style={styles.delta}>
            <Text style={styles.deltaLabel}>Potential additional retirement value</Text>
            <AnimatedAmount value={delta} format={(value) => `+${formatEuro(value)}`} style={styles.deltaValue} />
            <Text style={styles.deltaCompare}>
              {formatEuro(currentContribution)} → {formatEuro(contribution)} a month
              {'\n'}
              {formatEuro(baseline.projectedValue)} → {formatEuro(projected.projectedValue)} at {portal.customer.retirementAge}
            </Text>
          </View>
        ) : (
          <Text style={styles.sub}>This is your current contribution.</Text>
        )}

        <Card>
          <AreaChart
            height={240}
            showBand={changed}
            labels={labels}
            series={[
              ...(changed
                ? [
                    {
                      id: 'baseline',
                      values: baseline.points.map((point) => point.value),
                      color: theme.colors.chartBaseline,
                      dashed: true,
                    },
                  ]
                : []),
              {
                id: 'selected',
                values: projected.points.map((point) => point.value),
                color: theme.colors.navy,
                fill: true,
              },
            ]}
          />
          <Text style={styles.legend}>
            {changed ? 'Dashed line is your current plan. The shaded gap is the illustrated difference.' : 'Value from your age today through to retirement.'}
          </Text>
        </Card>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Card>
          <Text style={styles.sliderLabel}>Monthly contribution</Text>
          <Text style={styles.sliderValue}>{formatEuro(contribution)}</Text>
          <Slider
            minimumValue={MIN}
            maximumValue={MAX}
            step={STEP}
            value={contribution}
            minimumTrackTintColor={theme.colors.navy}
            maximumTrackTintColor={theme.colors.line}
            thumbTintColor={theme.colors.red}
            onValueChange={(value) => {
              const next = snap(value);
              if (next !== contribution && Platform.OS !== 'web') {
                Haptics.selectionAsync().catch(() => undefined);
              }
              setContribution(next);
            }}
          />
          <View style={styles.scale}>
            <Text style={styles.caption}>{formatEuro(MIN)}</Text>
            <Text style={styles.caption}>{formatEuro(MAX)}</Text>
          </View>
          <View style={styles.presets}>
            {PRESETS.map((amount) => {
              const active = amount === contribution;
              return (
                <Pressable
                  key={amount}
                  accessibilityRole="button"
                  onPress={() => setContribution(amount)}
                  style={[styles.preset, active && styles.presetActive, webPointer]}
                >
                  <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>{formatEuro(amount)}</Text>
                </Pressable>
              );
            })}
          </View>
          {changed ? (
            <Pressable accessibilityRole="button" onPress={() => setContribution(currentContribution)} style={webPointer}>
              <Text style={styles.reset}>Reset to current plan</Text>
            </Pressable>
          ) : null}
        </Card>

        <Card>
          <Text style={styles.sliderLabel}>Assumptions</Text>
          <Text style={styles.body}>
            {scenario.label} growth of {formatGrowthRate(scenario.annualGrowthRate)} a year, applied monthly, from age {portal.customer.age} to {portal.customer.retirementAge}. Contributions are assumed to continue unchanged. Charges, tax and market falls are not fully modelled.
          </Text>
          <IllustrativeNote />
        </Card>
      </ScrollView>
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
    gap: 12,
  },
  title: {
    ...theme.type.title,
    fontSize: 28,
    color: theme.colors.ink,
  },
  hero: {
    fontSize: 44,
    lineHeight: 50,
    color: theme.colors.navy,
  },
  sub: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  delta: {
    backgroundColor: theme.colors.positiveSoft,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    gap: 4,
  },
  deltaLabel: {
    ...theme.type.bodyStrong,
    color: theme.colors.positive,
  },
  deltaValue: {
    fontSize: 32,
    lineHeight: 38,
    color: theme.colors.positive,
  },
  deltaCompare: {
    ...theme.type.body,
    color: theme.colors.ink,
    marginTop: 4,
  },
  legend: {
    ...theme.type.caption,
    color: theme.colors.muted,
  },
  sliderLabel: {
    ...theme.type.bodyStrong,
    color: theme.colors.ink,
  },
  sliderValue: {
    fontFamily: 'SourceSerif4_600SemiBold',
    fontSize: 28,
    color: theme.colors.navy,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caption: {
    ...theme.type.caption,
    color: theme.colors.faint,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  preset: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.background,
  },
  presetActive: {
    backgroundColor: theme.colors.navy,
    borderColor: theme.colors.navy,
  },
  presetLabel: {
    ...theme.type.bodyStrong,
    fontSize: 14,
    color: theme.colors.ink,
  },
  presetLabelActive: {
    color: '#FFFFFF',
  },
  reset: {
    ...theme.type.bodyStrong,
    color: theme.colors.navy,
    marginTop: 8,
  },
  body: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  error: {
    ...theme.type.body,
    color: theme.colors.negative,
  },
});
