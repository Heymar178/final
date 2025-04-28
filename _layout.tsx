import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/supabaseClient';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const session = await supabase.auth.getSession();
        console.log('Supabase Session:', session);

        if (session.data.session) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
      } catch (err) {
        console.error('Unexpected error during auth check:', err);
      } finally {
        setAuthChecked(true); // Mark auth check as complete
      }
    };

    checkAuth();
  }, []);

  if (!loaded || !authChecked) {
    // Wait until fonts are loaded and auth check is complete
    console.log('Waiting for fonts or auth check...');
    return null;
  }

  console.log('Loaded:', loaded);
  console.log('Auth Checked:', authChecked);
  console.log('Is Authenticated:', isAuthenticated);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {isAuthenticated ? (
          <>
            {/* Authenticated Routes */}
            <Stack.Screen name="(tabs)/index" options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="(tabs)/Cart" options={{ title: 'Cart', headerShown: false }} />
            <Stack.Screen name="(tabs)/Orders" options={{ title: 'Orders', headerShown: false }} />
            <Stack.Screen name="ScanBarcode" options={{ title: 'Scan Barcode', headerShown: true }} />
          </>
        ) : (
          <>
            {/* Unauthenticated Routes */}
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}