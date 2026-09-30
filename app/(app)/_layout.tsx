import { Redirect, Stack, router, type Href } from 'expo-router';
import { usePortal } from '@/context/PortalContext';
import { NotificationBanner } from '@/components/NotificationBanner';
import { View } from 'react-native';

export default function AuthenticatedLayout() {
  const { isAuthenticated, banner, dismissBanner, markNotificationRead, notifications } = usePortal();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="policy/[id]" />
        <Stack.Screen name="projection" />
        <Stack.Screen name="protection" />
        <Stack.Screen name="demo" options={{ animation: 'fade_from_bottom' }} />
      </Stack>
      {banner ? (
        <NotificationBanner
          title={banner.title}
          body={banner.body}
          onDismiss={dismissBanner}
          onPress={() => {
            const match = notifications.find((item) => item.href === banner.href && item.title === banner.title);
            if (match) markNotificationRead(match.id);
            dismissBanner();
            router.push(banner.href as Href);
          }}
        />
      ) : null}
    </View>
  );
}
