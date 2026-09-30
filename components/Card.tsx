import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '@/theme';

export function Card({
  children,
  style,
  tone = 'surface',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'navy' | 'cream';
}) {
  return <View style={[styles.base, styles[tone], style]}>{children}</View>;
}

export function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <Text style={[styles.eyebrow, light ? styles.eyebrowLight : null]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    borderWidth: 1,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.line,
    ...theme.shadow.card,
  },
  navy: {
    backgroundColor: theme.colors.navy,
    borderColor: theme.colors.navy,
  },
  cream: {
    backgroundColor: theme.colors.cautionSoft,
    borderColor: '#EFE4CF',
  },
  eyebrow: {
    ...theme.type.label,
    color: theme.colors.muted,
  },
  eyebrowLight: {
    color: 'rgba(255,255,255,0.72)',
  },
});
