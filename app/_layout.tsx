import { Stack } from 'expo-router';
import { MacroProvider, useMacro } from '../components/MacroContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

function RootLayoutContent() {
  const { isLoading, error, userId } = useMacro();

  useEffect(() => {
    console.log('RootLayoutContent: isLoading:', isLoading, 'userId:', userId, 'error:', error);
  }, [isLoading, userId, error]);

  if (error) {
    console.log('RootLayoutContent: Showing error screen');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Bağlantı Hatası</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Lütfen internet bağlantınızı kontrol edin ve uygulamayı yeniden başlatın.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    console.log('RootLayoutContent: Showing loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  console.log('RootLayoutContent: Showing main navigation');
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  console.log('RootLayout: Initializing');
  return (
    <ErrorBoundary>
      <MacroProvider>
        <RootLayoutContent />
      </MacroProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 