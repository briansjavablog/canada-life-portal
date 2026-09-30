import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal } from '@/context/PortalContext';
import { theme } from '@/theme';
import { webPointer } from '@/utils/pressable';

export default function ProfileScreen() {
  const portal = usePortal();
  const [taps, setTaps] = useState(0);

  if (portal.status === 'loading' || portal.status === 'idle' || !portal.customer) {
    return (
      <Screen>
        {portal.status === 'error' ? (
          <ErrorState message={portal.error ?? 'Profile could not be loaded.'} onRetry={portal.reload} />
        ) : (
          <LoadingState />
        )}
      </Screen>
    );
  }

  const initials = `${portal.customer.firstName[0]}${portal.customer.lastName[0]}`;

  return (
    <Screen>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>
          {portal.customer.firstName} {portal.customer.lastName}
        </Text>
        <Text style={styles.meta}>Age {portal.customer.age}</Text>
        <Text style={styles.meta}>{portal.customer.email}</Text>
      </View>
      <View style={styles.card}>
        <Row label="Customer number" value={portal.customer.customerNumber} />
        <Row label="Retirement age" value={String(portal.customer.retirementAge)} />
        <Row label="Statements" value="Electronic" />
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          portal.logout();
          router.replace('/login');
        }}
        style={[styles.signOut, webPointer]}
      >
        <Text style={styles.signOutLabel}>Sign out</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          const next = taps + 1;
          if (next >= 5) {
            setTaps(0);
            router.push('/demo');
            return;
          }
          setTaps(next);
        }}
        style={webPointer}
      >
        <Text style={styles.version}>Portal prototype · 1.0.0</Text>
      </Pressable>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.space.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  initials: {
    fontFamily: 'SourceSans3_700Bold',
    color: '#FFFFFF',
    fontSize: 24,
  },
  name: {
    ...theme.type.heading,
    fontSize: 24,
    color: theme.colors.ink,
  },
  meta: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: theme.space.lg,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  rowLabel: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  rowValue: {
    ...theme.type.bodyStrong,
    color: theme.colors.ink,
  },
  signOut: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  signOutLabel: {
    ...theme.type.bodyStrong,
    color: theme.colors.red,
  },
  version: {
    ...theme.type.caption,
    color: theme.colors.faint,
    textAlign: 'center',
  },
});
