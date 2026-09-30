import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StatusStates';
import { usePortal } from '@/context/PortalContext';
import { theme } from '@/theme';
import { formatDate } from '@/utils/format';
import { webPointer } from '@/utils/pressable';

export default function NotificationsScreen() {
  const portal = usePortal();

  if (portal.status === 'loading' || portal.status === 'idle') {
    return (
      <Screen>
        <LoadingState label="Loading notifications" />
      </Screen>
    );
  }

  if (portal.status === 'error') {
    return (
      <Screen>
        <ErrorState message={portal.error ?? 'Notifications could not be loaded.'} onRetry={portal.reload} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.lead}>Updates about your policies and retirement outlook.</Text>
      {portal.notifications.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={() => {
            portal.markNotificationRead(item.id);
            router.push(item.href as Href);
          }}
          style={[styles.card, webPointer]}
        >
          <View style={styles.row}>
            {!item.read ? <View style={styles.unread} /> : <View style={styles.readSpacer} />}
            <View style={styles.copy}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </Pressable>
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.space.lg,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  unread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.red,
    marginTop: 8,
  },
  readSpacer: {
    width: 8,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    ...theme.type.bodyStrong,
    color: theme.colors.ink,
  },
  body: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  date: {
    ...theme.type.caption,
    color: theme.colors.faint,
    marginTop: 4,
  },
});
