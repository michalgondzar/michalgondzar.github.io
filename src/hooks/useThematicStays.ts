
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

const STORAGE_KEY = 'thematicStays';
const TIMESTAMP_KEY = 'thematicStaysTimestamp';

// Global state for cross-component synchronization
let globalStays: ThematicStay[] = DEFAULT_STAYS;
let globalTimestamp = Date.now();
let updateListeners: (() => void)[] = [];

const saveData = (stays: ThematicStay[]) => {
  const timestamp = Date.now();
  const dataToSave = {
    stays,
    timestamp,
    version: timestamp
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  localStorage.setItem(TIMESTAMP_KEY, timestamp.toString());
  
  globalStays = stays;
  globalTimestamp = timestamp;
  
  // Notify all listeners
  updateListeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('Error in update listener:', error);
    }
  });
  
  // Trigger storage event for cross-tab communication
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: JSON.stringify(dataToSave),
    storageArea: localStorage
  }));
  
  console.log('Thematic stays saved with timestamp:', timestamp);
};

const loadData = (): { stays: ThematicStay[], timestamp: number } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.stays && parsed.timestamp) {
        globalStays = parsed.stays;
        globalTimestamp = parsed.timestamp;
        console.log('Loaded thematic stays:', parsed);
        return { stays: parsed.stays, timestamp: parsed.timestamp };
      }
    }
  } catch (error) {
    console.error('Error loading thematic stays:', error);
  }
  
  // Return defaults
  const timestamp = Date.now();
  globalStays = DEFAULT_STAYS;
  globalTimestamp = timestamp;
  return { stays: DEFAULT_STAYS, timestamp };
};

export const useThematicStays = () => {
  const [stays, setStays] = useState<ThematicStay[]>(() => {
    const { stays: loadedStays } = loadData();
    return [...loadedStays];
  });
  const [updateCounter, setUpdateCounter] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(() => globalTimestamp);

  const checkForUpdates = useCallback(() => {
    const { stays: newStays, timestamp } = loadData();
    
    if (timestamp > lastTimestamp) {
      console.log('Update detected:', timestamp, '>', lastTimestamp);
      setStays([...newStays]);
      setLastTimestamp(timestamp);
      setUpdateCounter(prev => prev + 1);
      return true;
    }
    return false;
  }, [lastTimestamp]);

  const forceUpdate = useCallback(() => {
    const { stays: newStays, timestamp } = loadData();
    console.log('Force update triggered');
    setStays([...newStays]);
    setLastTimestamp(timestamp);
    setUpdateCounter(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Add to update listeners
    updateListeners.push(forceUpdate);
    
    // Storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        console.log('Storage change detected for thematic stays');
        setTimeout(checkForUpdates, 100);
      }
    };
    
    // Page visibility change listener
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, checking for updates');
        setTimeout(checkForUpdates, 200);
      }
    };
    
    // Window focus listener
    const handleFocus = () => {
      console.log('Window focused, checking for updates');
      setTimeout(checkForUpdates, 200);
    };
    
    // Mobile-specific touch listener
    const handleTouch = () => {
      setTimeout(checkForUpdates, 300);
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    
    // Aggressive polling for mobile
    const interval = setInterval(checkForUpdates, 3000);
    
    return () => {
      updateListeners = updateListeners.filter(listener => listener !== forceUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('touchstart', handleTouch);
      clearInterval(interval);
    };
  }, [forceUpdate, checkForUpdates]);

  const updateStays = useCallback((newStays: ThematicStay[]) => {
    saveData(newStays);
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
