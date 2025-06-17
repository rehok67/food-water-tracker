import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, child, Database } from 'firebase/database';
import { initializeAuth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseAuthUser, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config - google-services.json içindeki değerlerle doldurulmalı
const firebaseConfig = {
  apiKey: "AIzaSyCCtDb62S0DCmBWmzVX4Zsm8lD21qgUvuw",
  authDomain: "ios-projesi-food-logger.firebaseapp.com",
  databaseURL: "https://ios-projesi-food-logger-default-rtdb.firebaseio.com",
  projectId: "ios-projesi-food-logger",
  storageBucket: "ios-projesi-food-logger.appspot.com",
  messagingSenderId: "162613110062",
  appId: "1:162613110062:android:6e929ad985a296d9d546bf"
};

// Firebase uygulamasını başlat
let app: FirebaseApp;
let db: Database;
let auth: Auth;

try {
  // Firebase app'i initialize et
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Firebase already initialized');
  }

  // Database'i initialize et
  db = getDatabase(app);
  
  // Auth'u initialize et
  try {
    auth = getAuth(app);
    console.log('Firebase auth initialized successfully');
  } catch (authError) {
    // Fallback: initializeAuth ile tekrar dene
    try {
      auth = initializeAuth(app);
      console.log('Firebase auth initialized with fallback');
    } catch (fallbackError) {
      console.error('Firebase auth initialization failed:', fallbackError);
      // Son çare olarak getAuth'u tekrar dene
      auth = getAuth(app);
    }
  }
  
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Production'da hata fırlatma, sadece log'la
  if (__DEV__) {
    throw error;
  }
}

export { auth };

export const getCurrentUserId = (): string | null => {
  try {
    const user = auth?.currentUser;
    return user ? user.uid : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export interface FoodLog {
  id: string;
  foodName: string;
  timestamp: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface WaterLog {
  id: string;
  amount: number; // ml cinsinden
  timestamp: number;
}

export const addFoodLog = async (userId: string, foodLog: Omit<FoodLog, 'id'>) => {
  try {
    if (!userId) throw new Error("User ID is required to add food log.");
    if (!db) throw new Error("Database not initialized");
    
    const foodLogsRef = ref(db, `users/${userId}/foodLogs`);
    const newRef = push(foodLogsRef);
    await set(newRef, {
      ...foodLog,
      id: newRef.key,
    });
    console.log('Food log added successfully:', newRef.key);
    return newRef.key;
  } catch (error) {
    console.error('Error adding food log:', error);
    throw error;
  }
};

export const addWaterLog = async (userId: string, waterLog: Omit<WaterLog, 'id'>) => {
  try {
    if (!userId) throw new Error("User ID is required to add water log.");
    if (!db) throw new Error("Database not initialized");
    
    const waterLogsRef = ref(db, `users/${userId}/waterLogs`);
    const newRef = push(waterLogsRef);
    await set(newRef, {
      ...waterLog,
      id: newRef.key,
    });
    console.log('Water log added successfully:', newRef.key);
    return newRef.key;
  } catch (error) {
    console.error('Error adding water log:', error);
    throw error;
  }
};

export const getFoodLogs = async (userId: string): Promise<FoodLog[]> => {
  if (!userId) return [];
  try {
    if (!db) throw new Error("Database not initialized");
    
    const snapshot = await get(child(ref(db), `users/${userId}/foodLogs`));
    const data = snapshot.val();
    const result = data ? Object.values(data) as FoodLog[] : [];
    console.log('Food logs retrieved:', result.length);
    return result;
  } catch (e) {
    console.error('getFoodLogs error:', e);
    return [];
  }
};

export const getWaterLogs = async (userId: string): Promise<WaterLog[]> => {
  if (!userId) return [];
  try {
    if (!db) throw new Error("Database not initialized");
    
    const snapshot = await get(child(ref(db), `users/${userId}/waterLogs`));
    const data = snapshot.val();
    const result = data ? Object.values(data) as WaterLog[] : [];
    console.log('Water logs retrieved:', result.length);
    return result;
  } catch (e) {
    console.error('getWaterLogs error:', e);
    return [];
  }
};

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, FirebaseAuthUser }; 