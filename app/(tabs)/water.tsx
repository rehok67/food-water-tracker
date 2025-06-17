import { View, StyleSheet, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { addWaterLog, getWaterLogs, WaterLog } from '../../services/firebase';
import { useMacro } from '../../components/MacroContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getLast7Days() {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function WaterTracker() {
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [waterByDay, setWaterByDay] = useState<{ [date: string]: number }>({});
  const { userId, isLoading } = useMacro();
  const router = useRouter();

  const today = getToday();
  const totalToday = waterByDay[today] || 0;

  useEffect(() => {
    // Geçmiş su loglarını çek
    const fetchAndSetLogs = async () => {
      if (userId) {
        const logs = await getWaterLogs(userId);
        setWaterLogs(logs);
        // Günlere göre grupla
        const grouped: { [date: string]: number } = {};
        logs.forEach(log => {
          const date = new Date(log.timestamp).toISOString().slice(0, 10);
          grouped[date] = (grouped[date] || 0) + log.amount;
        });
        setWaterByDay(grouped);
      }
    };
    fetchAndSetLogs();
  }, [userId]); // userId bağımlılıklara ekleniyor

  const addWater = async (amount: number) => {
    if (!userId) {
      Alert.alert("Hata", "Lütfen giriş yapın.");
      return;
    }
    // Firebase'e kaydet
    await addWaterLog(userId, {
      amount,
      timestamp: Date.now(),
    });
    // Logları tekrar çek
    const logs = await getWaterLogs(userId);
    setWaterLogs(logs);
    // Günlere göre grupla
    const grouped: { [date: string]: number } = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().slice(0, 10);
      grouped[date] = (grouped[date] || 0) + log.amount;
    });
    setWaterByDay(grouped);
  };

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
        <Ionicons name="water-outline" size={64} color="#007AFF" />
        <Text style={styles.authTitle}>Su Takibi</Text>
        <Text style={styles.authMessage}>Su tüketiminizi takip etmek için giriş yapın</Text>
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

  const last7Days = getLast7Days();
  const chartData = {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [
      {
        data: last7Days.map(date => waterByDay[date] || 0),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Su Takibi</Text>
      <Text style={styles.totalAmount}>Bugün: {totalToday}ml</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addWater(250)}
        >
          <Text style={styles.buttonText}>250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addWater(500)}
        >
          <Text style={styles.buttonText}>500ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addWater(1000)}
        >
          <Text style={styles.buttonText}>1L</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={waterLogs.sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: 'bold' }}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text>{item.amount} ml</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>Geçmiş Su Logları</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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