import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { MacroTracker } from '../../components/MacroTracker';
import { useMacro } from '../../components/MacroContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const { currentMacros, userId, isLoading } = useMacro();
  const router = useRouter();

  // Kullanıcı durumu yüklenirken loading göster
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Kullanıcı giriş yapmamışsa login butonlu ana sayfa göster
  if (userId === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('/login')}
        >
          <Ionicons name="person-circle-outline" size={48} color="#007AFF" />
          <Text style={styles.loginText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const goalMacros = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/account')}>
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.macroTrackerContainer}>
        <MacroTracker currentMacros={currentMacros} goalMacros={goalMacros} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  profileButton: {
    padding: 4,
  },
  macroTrackerContainer: {
    flex: 1,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginText: {
    fontSize: 18,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '600',
  },
}); 