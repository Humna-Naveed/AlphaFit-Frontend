import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ALPHAFIT</Text>
      <Text style={styles.title}>Welcome back.</Text>
      <Text style={styles.body}>This is a placeholder for the sign-in screen.</Text>
      <Pressable onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonText}>Back to welcome</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#07100c',
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  eyebrow: {
    color: '#b7f34a',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 12,
  },
  body: {
    color: 'rgba(255, 255, 255, 0.68)',
    fontSize: 16,
    marginTop: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#b7f34a',
    borderRadius: 16,
    marginTop: 32,
    padding: 18,
  },
  buttonText: {
    color: '#101b0c',
    fontWeight: '800',
  },
});