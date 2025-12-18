import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

let authToken: string | null = null;
let initialized = false;
const STORAGE_KEY = 'authToken';

export const loadAuthToken = async () => {
  if (initialized) return authToken;

  // On web or if SecureStore is not available, fall back to localStorage/in-memory
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      authToken = window.localStorage.getItem(STORAGE_KEY);
    }
    initialized = true;
    return authToken;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    initialized = true;
    return authToken;
  }

  const stored = await SecureStore.getItemAsync(STORAGE_KEY);
  authToken = stored;
  initialized = true;
  return authToken;
};

export const setAuthToken = async (token: string | null) => {
  authToken = token;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      if (token) {
        window.localStorage.setItem(STORAGE_KEY, token);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    return;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    return;
  }

  if (token) {
    await SecureStore.setItemAsync(STORAGE_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  }
};

export const getAuthToken = () => authToken;

export const clearAuthToken = async () => {
  authToken = null;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    return;
  }

  await SecureStore.deleteItemAsync(STORAGE_KEY);
};

