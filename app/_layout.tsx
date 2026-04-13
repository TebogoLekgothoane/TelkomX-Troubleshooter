import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import 'react-native-reanimated';

// Prefer your custom hook and theme if available, otherwise fallback
import { useColorScheme, useInitialAndroidBarSync } from '@/lib/useColorScheme'; // or '@/hooks/useColorScheme'
import { NAV_THEME } from '@/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync?.();
  const { colorScheme, isDarkColorScheme } = (useColorScheme?.() as { colorScheme: 'light' | 'dark'; isDarkColorScheme: boolean }) || { colorScheme: 'light', isDarkColorScheme: false };
 
  
  // Use your NAV_THEME if available, otherwise fallback to React Navigation's themes
  const theme =
    NAV_THEME?.[colorScheme] ??
    (colorScheme === 'dark' ? DarkTheme : DefaultTheme);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <NavThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(agent)" />
          <Stack.Screen name="(technician)" />
          <Stack.Screen name="profile" options={{ headerShown: true, title: "Profile" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NavThemeProvider>
    </>
  );
}