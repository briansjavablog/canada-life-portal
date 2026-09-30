import Svg, { Path, Rect } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

/** Stand-in mark. Swap this component for the approved Canada Life logo later. */
export function BrandMark({ tone = 'dark', compact = false }: { tone?: 'dark' | 'light'; compact?: boolean }) {
  const word = tone === 'light' ? '#FFFFFF' : theme.colors.navy;
  const sub = tone === 'light' ? 'rgba(255,255,255,0.72)' : theme.colors.muted;

  return (
    <View style={styles.row}>
      <Svg width={compact ? 32 : 40} height={compact ? 32 : 40} viewBox="0 0 40 40">
        <Rect width="40" height="40" rx="12" fill={theme.colors.red} />
        <Path d="M20 8c2.4 4.2 3.6 6.6 3.6 10.2 0 4.6-1.6 8-3.6 10.4-2-2.4-3.6-5.8-3.6-10.4C16.4 14.6 17.6 12.2 20 8z" fill="#FFFFFF" />
        <Path d="M20 16.2c3.2 1 6.4 1.8 8.6 1.6-2.2 2.2-5.2 3.2-8.6 3.2s-6.4-1-8.6-3.2c2.2.2 5.4-.6 8.6-1.6z" fill="#FFFFFF" />
      </Svg>
      <View>
        <Text style={[styles.name, { color: word, fontSize: compact ? 16 : 20 }]}>{theme.colors.name}</Text>
        {!compact ? <Text style={[styles.market, { color: sub }]}>{theme.colors.market}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontFamily: 'SourceSerif4_600SemiBold',
    letterSpacing: -0.3,
  },
  market: {
    ...theme.type.caption,
    marginTop: -1,
  },
});
