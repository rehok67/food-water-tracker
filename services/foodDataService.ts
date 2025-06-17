import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_FOODDATA_API_KEY;
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface FoodSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }[];
}

export const searchFoods = async (query: string): Promise<FoodSearchResult[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/foods/search`, {
      params: {
        api_key: API_KEY,
        query: query,
        pageSize: 10,
      },
    });
    return response.data.foods;
  } catch (error) {
    console.error('Food search error:', error);
    throw error;
  }
};

export const getFoodDetails = async (fdcId: number): Promise<FoodSearchResult> => {
  try {
    const response = await axios.get(`${BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Food details error:', error);
    throw error;
  }
}; 