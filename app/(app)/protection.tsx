import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/FadeIn';
import { IllustrativeNote } from '@/components/IllustrativeNote';
import { StackHeader } from '@/components/StackHeader';
import { usePortal } from '@/context/PortalContext';
import { theme } from '@/theme';

const POINTS = [
  {
    title: 'If income stopped',
    body: 'Cover can help with everyday costs if illness meant you could not work for a while.',
  },
  {
    title: 'For the people who rely on you',
    body: 'Life cover can give a family time to adjust, alongside the savings you already have.',
  },
  {
    title: 'A conversation first',
    body: 'An adviser can look at what you already hold before suggesting anything new.',
  },
];

export default function ProtectionScreen() {
  const { customer } = usePortal();
  const insets = useSafeAreaInsets();
  const [requested, setRequested] = useState(false);
  const name = customer?.firstName ?? 'there';

  return (
    <View style={styles.root}>
      <StackHeader title="Protection" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Protect what matters, {name}</Text>
        <Text style={styles.lead}>
          You already save for your future with Canada Life. Protection is a different question: what happens if your income stops unexpectedly.
        </Text>
        {POINTS.map((point) => (
          <Card key={point.title}>
            <Text style={styles.point}>{point.title}</Text>
            <Text style={styles.body}>{point.body}</Text>
          </Card>
        ))}
        {requested ? (
          <FadeIn>
            <View style={styles.success}>
              <Ionicons name="checkmark-circle" size={28} color={theme.colors.positive} />
              <Text style={styles.point}>Request noted</Text>
              <Text style={styles.body}>
                In the live service this would reach an adviser. This prototype has not sent anything.
              </Text>
            </View>
          </FadeIn>
        ) : (
          <Button label="Request a conversation" onPress={() => setRequested(true)} />
        )}
        <IllustrativeNote>This screen is guidance only. It is not a quote and no application has been started.</IllustrativeNote>
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
  title: {
    ...theme.type.title,
    fontSize: 28,
    color: theme.colors.ink,
  },
  lead: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  point: {
    ...theme.type.heading,
    color: theme.colors.ink,
  },
  body: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  success: {
    backgroundColor: theme.colors.positiveSoft,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    gap: 6,
  },
});
