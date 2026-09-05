import { StyleSheet, Text, View } from 'react-native';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <View accessibilityLabel={`Step ${currentStep} of ${totalSteps}`} style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>YOUR PROGRESS</Text>
        <Text style={styles.step}>{currentStep} / {totalSteps}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 9 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#8FA39B', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  step: { color: '#B7F34A', fontSize: 12, fontWeight: '800' },
  track: { backgroundColor: '#1A2320', borderRadius: 4, height: 5, overflow: 'hidden' },
  fill: { backgroundColor: '#22C55E', borderRadius: 4, height: '100%' },
});
