import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { searchFoods, FoodSearchResult } from '../services/foodDataService';

interface FoodSearchProps {
  onFoodAdd: (food: FoodSearchResult) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onFoodAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (food: FoodSearchResult) => {
    onFoodAdd(food);
  };

  const renderItem = ({ item }: { item: FoodSearchResult }) => (
    <View style={styles.resultItem}>
      <Text style={styles.foodName}>{item.description}</Text>
      <Text style={styles.foodType}>{item.dataType}</Text>
      {item.foodNutrients.slice(0, 3).map((nutrient) => (
        <Text key={nutrient.nutrientId} style={styles.nutrient}>
          {nutrient.nutrientName}: {nutrient.value} {nutrient.unitName}
        </Text>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddFood(item)}
      >
        <Text style={styles.addButtonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Gıda ara..."
      />
      <Button title="Ara" onPress={handleSearch} />
      
      {loading ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.fdcId.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodType: {
    color: 'gray',
    marginBottom: 8,
  },
  nutrient: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 