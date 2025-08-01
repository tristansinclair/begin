import { StateStorage } from 'zustand/middleware';

// Custom storage object that handles localStorage
export const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  }
};

// Helper to check if data exists in localStorage
export const hasPersistedData = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(key) !== null;
};

// Helper to clear all app data from localStorage
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('begin-app-')) {
      localStorage.removeItem(key);
    }
  });
};

// Helper to export all data as JSON
export const exportData = (): string => {
  if (typeof window === 'undefined') return '{}';
  
  const data: Record<string, any> = {};
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('begin-app-')) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }
  });
  
  return JSON.stringify(data, null, 2);
};

// Helper to import data from JSON
export const importData = (jsonData: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const data = JSON.parse(jsonData);
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('begin-app-')) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  } catch (error) {
    console.error('Failed to import data:', error);
  }
};