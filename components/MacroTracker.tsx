import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { DailyMacros } from '../services/macroTrackerService';

interface MacroTrackerProps {
  currentMacros: DailyMacros;
  goalMacros: DailyMacros;
}

export const MacroTracker: React.FC<MacroTrackerProps> = ({ currentMacros, goalMacros }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: ['Kalori', 'Protein', 'Karbonhidrat', 'Yağ'],
    datasets: [
      {
        data: [
          currentMacros.calories,
          currentMacros.protein,
          currentMacros.carbs,
          currentMacros.fat
        ]
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.macroContainer}>
        <Text style={styles.title}>Günlük Makro Takibi</Text>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Kalori:</Text>
          <Text style={styles.macroValue}>
            {currentMacros.calories} / {goalMacros.calories} kcal
          </Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein:</Text>
          <Text style={styles.macroValue}>
            {currentMacros.protein}g / {goalMacros.protein}g
          </Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Karbonhidrat:</Text>
          <Text style={styles.macroValue}>
            {currentMacros.carbs}g / {goalMacros.carbs}g
          </Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Yağ:</Text>
          <Text style={styles.macroValue}>
            {currentMacros.fat}g / {goalMacros.fat}g
          </Text>
        </View>

        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  macroContainer: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  macroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 16,
    color: '#666',
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
}); 