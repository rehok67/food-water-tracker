import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useMacro } from '../components/MacroContext';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../services/firebase';

export default function Login() {
  const router = useRouter();
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail, userId, isLoading: contextLoading } = useMacro();

  // Kullanıcı giriş yaptığında otomatik olarak modal'ı kapat
  useEffect(() => {
    console.log('LOGIN DEBUG: userId changed:', userId, 'contextLoading:', contextLoading);
    if (userId && !contextLoading) {
      console.log('LOGIN DEBUG: About to navigate to tabs');
      // Küçük bir delay ile ana sayfaya yönlendir
      const timer = setTimeout(() => {
        console.log('LOGIN DEBUG: Navigating to tabs now');
        router.replace('/(tabs)');
        console.log('LOGIN DEBUG: Navigation command sent');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userId, contextLoading, router]);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Hata", "E-posta ve şifre alanları boş olamaz.");
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Başarılı", "Hesap oluşturuldu! Şimdi giriş yapabilirsiniz.");
        setIsRegistering(false); // Kayıt başarılı, giriş ekranına geri dön
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setEmail(email); // Email bilgisini context'e kaydet
        // useEffect userId değişikliğini yakalayacak ve navigation yapacak
      }
    } catch (error: any) {
      let errorMessage = "Bir hata oluştu.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifre en az 6 karakter olmalı.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-posta veya şifre yanlış.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'E-posta veya şifre yanlış.';
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Hata", errorMessage);
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context hala yükleniyorsa loading göster
  if (contextLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Eğer kullanıcı zaten giriş yapmışsa loading göster (useEffect navigation yapacak)
  if (userId) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Ana sayfaya yönlendiriliyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmailInput}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} disabled={isLoading}>
          <Text style={[styles.toggleText, isLoading && styles.textDisabled]}>
            {isRegistering ? 'Zaten bir hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#007AFF',
  },
  textDisabled: {
    color: '#ccc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});