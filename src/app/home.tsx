import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ALPHAFIT</Text>
      <Text style={styles.title}>Your dashboard is ready.</Text>
      <Text style={styles.body}>Your personalized fitness experience will appear here.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.button}>
        <Text style={styles.buttonText}>Return to welcome</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0A0F0D', flex: 1, justifyContent: 'center', padding: 28 },
  eyebrow: { color: '#B7F34A', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#F3F6F4', fontSize: 32, fontWeight: '800', marginTop: 12 },
  body: { color: '#8FA39B', fontSize: 16, lineHeight: 24, marginTop: 14 },
  button: { alignItems: 'center', backgroundColor: '#22C55E', borderRadius: 16, marginTop: 32, minHeight: 56, justifyContent: 'center' },
  buttonText: { color: '#101B0C', fontWeight: '800' },
});
