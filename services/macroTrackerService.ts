import { FoodSearchResult } from './foodDataService';

export interface DailyMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  foods: FoodSearchResult[];
  macros: DailyMacros;
}

export class MacroTracker {
  private meals: Meal[] = [];
  private dailyGoal: DailyMacros = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  addMeal(meal: Meal) {
    this.meals.push(meal);
  }

  removeMeal(mealId: string) {
    this.meals = this.meals.filter(meal => meal.id !== mealId);
  }

  getTotalMacros(): DailyMacros {
    return this.meals.reduce((total, meal) => ({
      calories: total.calories + meal.macros.calories,
      protein: total.protein + meal.macros.protein,
      carbs: total.carbs + meal.macros.carbs,
      fat: total.fat + meal.macros.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }

  getDailyGoal(): DailyMacros {
    return this.dailyGoal;
  }

  setDailyGoal(goal: DailyMacros) {
    this.dailyGoal = goal;
  }

  getMeals(): Meal[] {
    return this.meals;
  }
} 