import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SegmentedControl } from '@/components/SegmentedControl';
import { StackHeader } from '@/components/StackHeader';
import { usePortal } from '@/context/PortalContext';
import { projectionScenarios } from '@/data/scenarios';
import type { ProjectionScenarioId } from '@/models';
import type { DataSource } from '@/services/config';
import { theme } from '@/theme';

export default function DemoControlsScreen() {
  const portal = usePortal();
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState('Presenter tools stay off the customer navigation.');

  const send = async (kind: 'retirement' | 'protection') => {
    const result =
      kind === 'retirement'
        ? await portal.triggerDemoNotification({
            title: 'Canada Life',
            body: 'Alex, see how a small increase in contributions could affect your retirement.',
            href: '/projection',
            kind: 'contribution',
          })
        : await portal.triggerDemoNotification({
            title: 'Canada Life',
            body: 'Alex, explore protection that could help look after your family’s financial future.',
            href: '/protection',
            kind: 'protection',
          });
    setStatus(result.message);
  };

  return (
    <View style={styles.root}>
      <StackHeader title="Demo controls" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>
          For hackathon presenters. Customers reach this only by tapping the version on Profile five times.
        </Text>
        <Card>
          <Text style={styles.heading}>Notifications</Text>
          <Button label="Trigger retirement notification" onPress={() => void send('retirement')} />
          <Button label="Trigger cross-sell notification" onPress={() => void send('protection')} variant="secondary" />
          <Text style={styles.body}>{status}</Text>
        </Card>
        <Card>
          <Text style={styles.heading}>Projection scenario</Text>
          <Text style={styles.body}>Changes the illustrative growth rate on Home and the projection screen.</Text>
          <SegmentedControl
            options={projectionScenarios.map((scenario) => ({ value: scenario.id, label: scenario.label }))}
            value={portal.scenarioId}
            onChange={(id: ProjectionScenarioId) => portal.setScenario(id)}
          />
        </Card>
        <Card>
          <Text style={styles.heading}>Data source</Text>
          <Text style={styles.body}>
            Mock mode is the reliable demo path. API mode calls the configured base URL and should fail closed if nothing is there.
          </Text>
          <SegmentedControl
            options={[
              { value: 'mock', label: 'Mock' },
              { value: 'api', label: 'API' },
            ]}
            value={portal.dataSource}
            onChange={(source: DataSource) => portal.setDataSource(source)}
          />
        </Card>
        <Button
          label="Reset demo"
          variant="secondary"
          onPress={() => {
            portal.resetDemo();
            setStatus('Demo reset to Alex’s starting point.');
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.space.lg,
    gap: theme.space.md,
  },
  lead: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  heading: {
    ...theme.type.heading,
    color: theme.colors.ink,
  },
  body: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
});
