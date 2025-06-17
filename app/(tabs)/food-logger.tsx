import { View, StyleSheet, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FoodSearch } from '../../components/FoodSearch';
import { useMacro } from '../../components/MacroContext';
import { useEffect, useState, useCallback } from 'react';
import { addFoodLog, getFoodLogs, FoodLog } from '../../services/firebase';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function getTodayDateString() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function FoodLogger() {
  const { currentMacros, setCurrentMacros, userId, isLoading } = useMacro();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const router = useRouter();

  const calculateDailyMacros = useCallback((logs: FoodLog[]) => {
    const today = getTodayDateString();
    const dailyLogs = logs.filter(log =>
      new Date(log.timestamp).toISOString().slice(0, 10) === today
    );

    const totalCalories = dailyLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
    const totalProtein = dailyLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const totalCarbs = dailyLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const totalFat = dailyLogs.reduce((sum, log) => sum + (log.fat || 0), 0);

    setCurrentMacros(prev => ({
      ...prev,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    }));
  }, [setCurrentMacros]);

  useEffect(() => {
    const fetchAndSetLogs = async () => {
      if (userId) {
        const logs = await getFoodLogs(userId);
        setFoodLogs(logs);
        calculateDailyMacros(logs);
      }
    };
    fetchAndSetLogs();
  }, [userId, calculateDailyMacros]);

  // Kullanıcı durumu yüklenirken loading göster
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Kullanıcı giriş yapmamışsa login butonlu sayfa göster
  if (userId === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="restaurant-outline" size={64} color="#007AFF" />
        <Text style={styles.authTitle}>Gıda Günlüğü</Text>
        <Text style={styles.authMessage}>Yemeklerinizi takip etmek için giriş yapın</Text>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('/login')}
        >
          <Ionicons name="log-in-outline" size={20} color="white" />
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.foodSearchContainer}>
        <FoodSearch onFoodAdd={async (food) => {
          if (!userId) {
            Alert.alert("Hata", "Lütfen giriş yapın.");
            return;
          }
          // Firebase'e kaydet
          const newFoodLog: Omit<FoodLog, 'id'> = {
            foodName: food.description,
            timestamp: Date.now(),
            calories: food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0,
            protein: food.foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0,
            carbs: food.foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
            fat: food.foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0,
          };
          await addFoodLog(userId, newFoodLog);

          // Logları tekrar çek ve makroları güncelle
          const updatedLogs = await getFoodLogs(userId);
          setFoodLogs(updatedLogs);
          calculateDailyMacros(updatedLogs);
        }} />
      </View>
      <FlatList
        data={foodLogs.sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.foodName}</Text>
            <Text>{new Date(item.timestamp).toLocaleString()} - {item.calories} kcal</Text>
            <Text>Protein: {item.protein || 0}g, Karbonhidrat: {item.carbs || 0}g, Yağ: {item.fat || 0}g</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>Geçmiş Yemek Logları</Text>}
      />
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
    padding: 20,
  },
  foodSearchContainer: {
    flex: 1,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  authMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 