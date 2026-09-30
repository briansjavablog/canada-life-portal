import { StyleSheet, Text } from 'react-native';
import { router, type Href } from 'expo-router';
import { NextBestActionCard } from '@/components/NextBestActionCard';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal } from '@/context/PortalContext';
import { theme } from '@/theme';

export default function ExploreScreen() {
  const portal = usePortal();
  const actions = portal.actions.filter((action) => action.surface === 'guidance');

  if (portal.status === 'loading' || portal.status === 'idle') {
    return (
      <Screen>
        <LoadingState label="Preparing guidance" />
      </Screen>
    );
  }

  if (portal.status === 'error') {
    return (
      <Screen>
        <ErrorState message={portal.error ?? 'Guidance could not be loaded.'} onRetry={portal.reload} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.lead}>
        Guidance based on your policies and retirement outlook. These are personal prompts, not product offers.
      </Text>
      {actions.map((action) => (
        <NextBestActionCard key={action.id} action={action} onPress={() => router.push(action.href as Href)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.type.title,
    color: theme.colors.ink,
  },
  lead: {
    ...theme.type.body,
    color: theme.colors.muted,
    marginTop: -8,
  },
});
