import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AreaChart } from '@/components/AreaChart';
import { Button } from '@/components/Button';
import { Card, Eyebrow } from '@/components/Card';
import { FadeIn } from '@/components/FadeIn';
import { IllustrativeNote } from '@/components/IllustrativeNote';
import { NextBestActionCard } from '@/components/NextBestActionCard';
import { PolicyCard } from '@/components/PolicyCard';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal, useScenario } from '@/context/PortalContext';
import { theme } from '@/theme';
import { formatEuro, formatGrowthRate, formatPercent } from '@/utils/format';
import { describeOutlook, greeting } from '@/utils/outlook';
import { summarisePortfolio } from '@/utils/portfolio';
import { webPointer } from '@/utils/pressable';

export default function HomeScreen() {
  const portal = usePortal();
  const scenario = useScenario();

  if (portal.status === 'loading' || portal.status === 'idle') {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (portal.status === 'error' || !portal.customer) {
    return (
      <Screen>
        <ErrorState
          message={portal.error ?? 'Your policies could not be loaded.'}
          onRetry={portal.reload}
          onUseMock={portal.dataSource === 'api' ? () => portal.setDataSource('mock') : undefined}
        />
      </Screen>
    );
  }

  const summary = summarisePortfolio(portal.policies);
  const outlook = portal.retirementProjection ? describeOutlook(portal.retirementProjection.projectedValue) : null;
  const homeAction = portal.actions.find((action) => action.surface === 'home') ?? portal.actions[0];
  const points = portal.retirementProjection?.points.map((point) => point.value) ?? [];
  const ages = portal.retirementProjection?.points ?? [];

  return (
    <Screen>
      <FadeIn>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting()}, {portal.customer.firstName}
            </Text>
            <Text style={styles.sub}>Your policies at a glance</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} style={[styles.bell, webPointer]}>
            <Ionicons name="notifications-outline" size={22} color={theme.colors.navy} />
            {portal.unreadCount > 0 ? <View style={styles.dot} /> : null}
          </Pressable>
        </View>
      </FadeIn>

      <FadeIn delay={40}>
        <Card tone="navy">
          <Eyebrow light>Total portfolio</Eyebrow>
          <Text style={styles.total}>{formatEuro(summary.totalValue)}</Text>
          <Text style={styles.movement}>
            {formatEuro(summary.movement)} · {formatPercent(summary.performanceYtd)} this year
          </Text>
        </Card>
      </FadeIn>

      <View style={styles.stack}>
        {portal.policies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} showSummary={false} onPress={() => router.push(`/policy/${policy.id}`)} />
        ))}
      </View>

      {portal.retirementProjection && outlook ? (
        <FadeIn delay={80}>
          <Card>
            <Eyebrow>Your retirement outlook</Eyebrow>
            <View style={styles.outlookRow}>
              <Text style={styles.outlookTitle}>{outlook.label}</Text>
              <Ionicons
                name={outlook.onTrack ? 'checkmark-circle' : 'alert-circle'}
                size={22}
                color={outlook.onTrack ? theme.colors.positive : theme.colors.caution}
              />
            </View>
            <Text style={styles.caption}>Projected value at age {portal.customer.retirementAge}</Text>
            <Text style={styles.projected}>{formatEuro(portal.retirementProjection.projectedValue)}</Text>
            <AreaChart
              compact
              height={120}
              series={[{ id: 'outlook', values: points, color: theme.colors.navy, fill: true }]}
            />
            <Text style={styles.assumption}>
              {scenario.label} assumption · {formatGrowthRate(scenario.annualGrowthRate)} a year · ages {ages[0]?.age}–{ages[ages.length - 1]?.age}
            </Text>
            <Button label="Explore your projection" onPress={() => router.push('/projection')} />
            <IllustrativeNote />
          </Card>
        </FadeIn>
      ) : null}

      {homeAction ? (
        <FadeIn delay={120}>
          <NextBestActionCard action={homeAction} onPress={() => router.push(homeAction.href as '/projection')} />
        </FadeIn>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...theme.type.title,
    fontSize: 28,
    color: theme.colors.ink,
  },
  sub: {
    ...theme.type.body,
    color: theme.colors.muted,
    marginTop: 2,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.red,
  },
  total: {
    fontFamily: 'SourceSerif4_600SemiBold',
    fontSize: 42,
    lineHeight: 48,
    color: '#FFFFFF',
    marginTop: 8,
  },
  movement: {
    ...theme.type.bodyStrong,
    color: '#B7E4CC',
    marginTop: 6,
  },
  stack: {
    gap: theme.space.md,
  },
  outlookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  outlookTitle: {
    ...theme.type.heading,
    color: theme.colors.ink,
  },
  caption: {
    ...theme.type.caption,
    color: theme.colors.muted,
    marginTop: 12,
  },
  projected: {
    fontFamily: 'SourceSerif4_600SemiBold',
    fontSize: 32,
    lineHeight: 38,
    color: theme.colors.navy,
    marginBottom: 4,
  },
  assumption: {
    ...theme.type.caption,
    color: theme.colors.muted,
    marginBottom: 4,
  },
});
