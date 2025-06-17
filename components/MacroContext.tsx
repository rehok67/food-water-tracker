import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DailyMacros } from '../services/macroTrackerService';
import { auth, onAuthStateChanged, FirebaseAuthUser } from '../services/firebase';

interface MacroContextType {
  currentMacros: DailyMacros;
  setCurrentMacros: React.Dispatch<React.SetStateAction<DailyMacros>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
}

const defaultMacros: DailyMacros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

const MacroContext = createContext<MacroContextType | undefined>(undefined);

export function MacroProvider({ children }: { children: ReactNode }) {
  const [currentMacros, setCurrentMacros] = useState<DailyMacros>(defaultMacros);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    try {
      // Auth state listener'ı kur
      unsubscribe = onAuthStateChanged(auth, (user: FirebaseAuthUser | null) => {
        try {
          console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
          
          if (user) {
            setUserId(user.uid);
            setEmail(user.email || '');
            console.log('User ID set:', user.uid);
          } else {
            setUserId(null);
            setEmail('');
            // Çıkış yapıldığında makro değerlerini sıfırla
            setCurrentMacros(defaultMacros);
            console.log('User logged out, data cleared');
          }
          
          setIsLoading(false);
          setError(null);
        } catch (err) {
          console.error('Auth state change error:', err);
          setError('Authentication error occurred');
          setIsLoading(false);
        }
      });
      
      console.log('Auth listener set up successfully');
    } catch (err) {
      console.error('Firebase initialization error:', err);
      setError('Firebase connection failed');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up auth listener');
        unsubscribe();
      }
    };
  }, []);

  return (
    <MacroContext.Provider value={{ 
      currentMacros, 
      setCurrentMacros, 
      email, 
      setEmail, 
      userId, 
      isLoading, 
      error 
    }}>
      {children}
    </MacroContext.Provider>
  );
}

export function useMacro() {
  const context = useContext(MacroContext);
  if (!context) {
    throw new Error('useMacro must be used within a MacroProvider');
  }
  return context;
} 