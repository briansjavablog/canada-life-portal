import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { usePortal } from '@/context/PortalContext';
import { demoLogin } from '@/data/mockCustomer';
import { theme } from '@/theme';
import { webPointer } from '@/utils/pressable';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, login } = usePortal();
  const [email, setEmail] = useState(demoLogin.email);
  const [password, setPassword] = useState(demoLogin.password);
  const [secure, setSecure] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const signIn = () => {
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      login();
      router.replace('/');
    }, 420);
  };

  return (
    <LinearGradient colors={[theme.colors.navy, theme.colors.navyDeep]} style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 28 }]}>
          <BrandMark tone="light" />
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.lead}>Sign in to see your policies and retirement outlook.</Text>
        </View>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor={theme.colors.faint}
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              autoCapitalize="none"
              style={[styles.input, styles.passwordInput]}
              placeholderTextColor={theme.colors.faint}
            />
            <Pressable accessibilityRole="button" onPress={() => setSecure((value) => !value)} style={[styles.showButton, webPointer]}>
              <Text style={styles.show}>{secure ? 'Show' : 'Hide'}</Text>
            </Pressable>
          </View>
          <Button label={submitting ? 'Signing in…' : 'Sign in'} onPress={signIn} disabled={submitting} />
          <Pressable accessibilityRole="button" onPress={signIn} style={[styles.biometric, webPointer]}>
            <Ionicons name="finger-print" size={22} color={theme.colors.navy} />
            <Text style={styles.biometricLabel}>Use biometrics</Text>
          </Pressable>
          <Text style={styles.note}>Demo access signs in as Alex Morgan. No password is checked.</Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.xxl,
    gap: theme.space.md,
  },
  welcome: {
    ...theme.type.title,
    color: '#FFFFFF',
    marginTop: theme.space.lg,
  },
  lead: {
    ...theme.type.body,
    color: 'rgba(255,255,255,0.78)',
  },
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.xl,
    gap: theme.space.sm,
  },
  label: {
    ...theme.type.bodyStrong,
    color: theme.colors.ink,
    marginTop: theme.space.sm,
  },
  input: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: theme.space.md,
    ...theme.type.body,
    color: theme.colors.ink,
    backgroundColor: theme.colors.background,
  },
  passwordRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 64,
  },
  showButton: {
    position: 'absolute',
    right: 14,
    height: 52,
    justifyContent: 'center',
  },
  show: {
    ...theme.type.bodyStrong,
    color: theme.colors.navy,
  },
  biometric: {
    marginTop: theme.space.sm,
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  biometricLabel: {
    ...theme.type.bodyStrong,
    color: theme.colors.navy,
  },
  note: {
    ...theme.type.caption,
    color: theme.colors.faint,
    textAlign: 'center',
    marginTop: theme.space.sm,
  },
});
