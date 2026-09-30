import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Stack, router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SourceSans3_400Regular, SourceSans3_600SemiBold, SourceSans3_700Bold } from '@expo-google-fonts/source-sans-3';
import { SourceSerif4_600SemiBold } from '@expo-google-fonts/source-serif-4';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider } from '@/context/PortalContext';
import { useNotificationObserver } from '@/hooks/useNotificationObserver';
import { theme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function Navigation() {
  const onUrl = useCallback((url: string) => {
    router.push(url as Href);
  }, []);
  useNotificationObserver(onUrl);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
    SourceSerif4_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.desk, alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: theme.frame.maxWidth, backgroundColor: theme.colors.background }}>
          <PortalProvider>
            <StatusBar style="dark" />
            <Navigation />
          </PortalProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
