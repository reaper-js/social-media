import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const GlobalContext = createContext();

function GlobalProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkAuthStatus();
    }, 0);
    
    return () => clearTimeout(timeout);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setTimeout(() => {
            router.replace('/home');
          }, 0);
        } else {
          await SecureStore.deleteItemAsync('userToken');
          setTimeout(() => {
            router.replace('/sign-in');
          }, 0);
        }
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData, token) => {
    await SecureStore.setItemAsync('userToken', token);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
    router.replace('/sign-in');
  };

  const value = {
    user,
    isLoading,
    login,
    logout
  };

  if (isLoading) {
    return null;
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}

export { GlobalProvider, useGlobal };
