
import { useState, useEffect, useCallback } from 'react';

interface ThematicStay {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

const DEFAULT_STAYS: ThematicStay[] = [
  {
    id: "manzelsky",
    title: "Manželský pobyt",
    description: "Romantický pobyt pre páry s možnosťou relaxu a súkromia. Ideálny na oslavu výročia alebo jednoducho na strávenie kvalitného času spolu.",
    image: "/lovable-uploads/0b235c75-170d-4c29-b94b-ea1fc022003f.png",
    icon: "Heart",
    features: ["Romantická atmosféra", "Súkromie", "Relaxácia pre dvoch"]
  },
  {
    id: "rodinny",
    title: "Rodinný pobyt",
    description: "Pobyt vhodný pre celú rodinu s deťmi. Priestranný apartmán s pohodlným ubytovaním a blízkosťou k rodinným aktivitám.",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
    icon: "Users",
    features: ["Vhodné pre deti", "Priestranný apartmán", "Rodinné aktivity"]
  },
  {
    id: "komorka",
    title: "Pobyt v komôrke",
    description: "Exkluzívny a pokojný pobyt v tichej časti apartmánu. Ideálny pre tých, ktorí hľadajú úplné súkromie a relaxáciu.",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
    icon: "Coffee",
    features: ["Absolútne súkromie", "Tichá lokalita", "Relaxačná atmosféra"]
  }
];

const STORAGE_KEY = 'apartmentThematicStays';

// Global state management
let globalStays: ThematicStay[] = DEFAULT_STAYS;
let listeners: (() => void)[] = [];

const loadFromStorage = (): ThematicStay[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Loaded thematic stays from storage:', parsed);
      globalStays = parsed;
      return parsed;
    }
  } catch (error) {
    console.error('Error loading thematic stays:', error);
  }
  globalStays = DEFAULT_STAYS;
  return DEFAULT_STAYS;
};

const saveToStorage = (stays: ThematicStay[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stays));
    globalStays = stays;
    
    // Notify all listeners
    listeners.forEach(listener => listener());
    
    // Trigger multiple events for cross-component communication
    window.dispatchEvent(new CustomEvent('thematicStaysUpdated', { detail: stays }));
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(stays),
      storageArea: localStorage
    }));
    
    console.log('Saved thematic stays and notified listeners:', stays);
  } catch (error) {
    console.error('Error saving thematic stays:', error);
  }
};

export const useThematicStays = () => {
  const [stays, setStays] = useState<ThematicStay[]>(() => loadFromStorage());
  const [updateCounter, setUpdateCounter] = useState(0);

  const forceUpdate = useCallback(() => {
    const newStays = loadFromStorage();
    setStays([...newStays]);
    setUpdateCounter(prev => prev + 1);
    console.log('Force updated thematic stays:', newStays);
  }, []);

  useEffect(() => {
    // Add this component to listeners
    listeners.push(forceUpdate);
    
    // Load initial data
    forceUpdate();

    // Setup multiple event listeners for robust updates
    const handleStorageChange = () => {
      console.log('Storage change detected in hook');
      forceUpdate();
    };

    const handleCustomEvent = (event: CustomEvent) => {
      console.log('Custom thematic stays event received:', event.detail);
      forceUpdate();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible, checking for thematic stays updates');
        setTimeout(forceUpdate, 100);
      }
    };

    const handleFocus = () => {
      console.log('Window focused, checking for thematic stays updates');
      setTimeout(forceUpdate, 100);
    };

    // Multiple event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('thematicStaysUpdated', handleCustomEvent as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Periodic check for mobile reliability (every 3 seconds)
    const intervalId = setInterval(() => {
      const currentStored = localStorage.getItem(STORAGE_KEY);
      const currentStringified = JSON.stringify(globalStays);
      
      if (currentStored && currentStored !== currentStringified) {
        console.log('Periodic check detected changes, updating...');
        forceUpdate();
      }
    }, 3000);

    return () => {
      // Remove from listeners
      listeners = listeners.filter(listener => listener !== forceUpdate);
      
      // Cleanup event listeners
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('thematicStaysUpdated', handleCustomEvent as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [forceUpdate]);

  const updateStays = useCallback((newStays: ThematicStay[]) => {
    saveToStorage(newStays);
    setStays([...newStays]);
    setUpdateCounter(prev => prev + 1);
  }, []);

  return {
    stays,
    updateStays,
    updateCounter,
    forceUpdate
  };
};
