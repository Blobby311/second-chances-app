import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Auth token storage
let authToken: string | null = null;
let initialized = false;
const STORAGE_KEY = 'authToken';

// Preferred role storage (buyer/seller)
export type UserRole = 'buyer' | 'seller';
let preferredRole: UserRole | null = null;
let roleInitialized = false;
const ROLE_STORAGE_KEY = 'preferredRole';

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

// Preferred role helpers
export const loadPreferredRole = async () => {
  if (roleInitialized) return preferredRole;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
      preferredRole = stored === 'buyer' || stored === 'seller' ? stored : null;
    }
    roleInitialized = true;
    return preferredRole;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    roleInitialized = true;
    return preferredRole;
  }

  const stored = await SecureStore.getItemAsync(ROLE_STORAGE_KEY);
  preferredRole = stored === 'buyer' || stored === 'seller' ? (stored as UserRole) : null;
  roleInitialized = true;
  return preferredRole;
};

export const setPreferredRole = async (role: UserRole | null) => {
  preferredRole = role;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      if (role) {
        window.localStorage.setItem(ROLE_STORAGE_KEY, role);
      } else {
        window.localStorage.removeItem(ROLE_STORAGE_KEY);
      }
    }
    return;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    return;
  }

  if (role) {
    await SecureStore.setItemAsync(ROLE_STORAGE_KEY, role);
  } else {
    await SecureStore.deleteItemAsync(ROLE_STORAGE_KEY);
  }
};

export const getPreferredRole = () => preferredRole;

