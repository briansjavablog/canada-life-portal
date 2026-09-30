import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';
import { webPointer } from '@/utils/pressable';

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fill = false,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Equal-width chips that wrap into a tidy grid. */
  fill?: boolean;
}) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.item, fill ? styles.fill : null, selected ? styles.selected : null, webPointer]}
          >
            <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.line,
    alignItems: 'center',
  },
  fill: {
    flexGrow: 1,
    flexBasis: '46%',
  },
  selected: {
    backgroundColor: theme.colors.navy,
    borderColor: theme.colors.navy,
  },
  label: {
    ...theme.type.bodyStrong,
    fontSize: 14,
    color: theme.colors.ink,
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
