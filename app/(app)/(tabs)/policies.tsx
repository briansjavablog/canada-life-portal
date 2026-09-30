import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { PolicyCard } from '@/components/PolicyCard';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal } from '@/context/PortalContext';
import { theme } from '@/theme';

export default function PoliciesScreen() {
  const portal = usePortal();

  if (portal.status === 'loading' || portal.status === 'idle') {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (portal.status === 'error') {
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

  return (
    <Screen>
      <Text style={styles.title}>Policies</Text>
      <Text style={styles.lead}>Two active products, valued in euro.</Text>
      {portal.policies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} onPress={() => router.push(`/policy/${policy.id}`)} />
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
