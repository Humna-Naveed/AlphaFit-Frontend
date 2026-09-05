import { router } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200',
      }}
      resizeMode="cover"
      style={styles.background}>
      <View style={styles.imageTint} />
      <View style={styles.bottomShade} />

      <View style={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>AF</Text>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.branding}>
            <Text style={styles.brandingLight}>Alpha</Text>
            <Text style={styles.brandingAccent}>Fit</Text>
          </Text>
          <Text style={styles.subtitle}>Your AI-powered fitness companion</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Get started"
            onPress={() => router.push('/get-started')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={() => router.push('/sign-in')}
            style={({ pressed }) => [styles.signIn, pressed && styles.buttonPressed]}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInAccent}>Sign in</Text>
          </Pressable>

          <View accessibilityLabel="Onboarding step 1 of 3" style={styles.indicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#07100c',
  },
  imageTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(4, 12, 8, 0.36)',
  },
  bottomShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(2, 7, 5, 0.35)',
    opacity: 0.95,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 14,
  },
  brandMarkText: {
    color: '#b7f34a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bottomContent: {
    alignItems: 'center',
  },
  welcome: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  branding: {
    marginTop: 2,
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  brandingLight: {
    color: '#ffffff',
  },
  brandingAccent: {
    color: '#b7f34a',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 15,
    letterSpacing: 0.2,
    marginTop: 8,
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#b7f34a',
    borderRadius: 18,
    marginTop: 30,
    minHeight: 58,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#101b0c',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  signIn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  signInText: {
    color: 'rgba(255, 255, 255, 0.68)',
    fontSize: 14,
  },
  signInAccent: {
    color: '#b7f34a',
    fontSize: 14,
    fontWeight: '700',
  },
  indicators: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 30,
  },
  indicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  activeIndicator: {
    backgroundColor: '#b7f34a',
    width: 24,
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
