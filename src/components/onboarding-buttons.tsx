import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface OnboardingButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
}

export function OnboardingButton({ label, onPress, disabled = false, loading = false, secondary = false }: OnboardingButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary ? styles.secondary : styles.primary, pressed && styles.pressed, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color="#101B0C" /> : <Text style={[styles.label, secondary && styles.secondaryLabel]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', borderRadius: 16, justifyContent: 'center', minHeight: 56, paddingHorizontal: 20 },
  primary: { backgroundColor: '#22C55E' },
  secondary: { backgroundColor: 'transparent', borderColor: '#314139', borderWidth: 1 },
  label: { color: '#101B0C', fontSize: 15, fontWeight: '800' },
  secondaryLabel: { color: '#F3F6F4' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.55 },
});
