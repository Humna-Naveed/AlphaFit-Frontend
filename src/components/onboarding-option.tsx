import { Pressable, StyleSheet, Text } from 'react-native';

interface OnboardingOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

export function OnboardingOption({ label, selected, onPress, multiSelect = false }: OnboardingOptionProps) {
  return (
    <Pressable
      accessibilityRole={multiSelect ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected, selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      <Text style={[styles.mark, selected && styles.selectedMark]}>{selected ? '✓' : multiSelect ? '+' : '○'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    backgroundColor: '#141C19',
    borderColor: '#24312B',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 18,
  },
  selected: { backgroundColor: '#18291D', borderColor: '#22C55E' },
  pressed: { opacity: 0.78 },
  label: { color: '#F3F6F4', flex: 1, fontSize: 15, fontWeight: '600' },
  selectedLabel: { color: '#B7F34A' },
  mark: { color: '#8FA39B', fontSize: 21, fontWeight: '500', marginLeft: 12 },
  selectedMark: { color: '#22C55E', fontWeight: '800' },
});
