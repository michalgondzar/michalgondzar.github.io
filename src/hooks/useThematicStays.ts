
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
const VERSION_KEY = 'apartmentThematicStaysVersion';

// Global state management with versioning
let globalStays: ThematicStay[] = DEFAULT_STAYS;
let globalVersion = 0;
let listeners: (() => void)[] = [];

const generateVersion = () => Date.now();

const loadFromStorage = (): { stays: ThematicStay[], version: number } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedVersion = localStorage.getItem(VERSION_KEY);
    
    if (saved && savedVersion) {
      const parsed = JSON.parse(saved);
      const version = parseInt(savedVersion, 10);
      console.log('Loaded thematic stays from storage:', parsed, 'version:', version);
      globalStays = parsed;
      globalVersion = version;
      return { stays: parsed, version };
    }
  } catch (error) {
    console.error('Error loading thematic stays:', error);
  }
  
  // Initialize with default data and version
  const version = generateVersion();
  globalStays = DEFAULT_STAYS;
  globalVersion = version;
  saveToStorage(DEFAULT_STAYS, version);
  return { stays: DEFAULT_STAYS, version };
};

const saveToStorage = (stays: ThematicStay[], version?: number) => {
  try {
    const newVersion = version || generateVersion();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stays));
    localStorage.setItem(VERSION_KEY, newVersion.toString());
    
    globalStays = stays;
    globalVersion = newVersion;
    
    // Broadcast changes with multiple methods for cross-device support
    const updateData = { stays, version: newVersion, timestamp: Date.now() };
    
    // Method 1: Storage events
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(stays),
      storageArea: localStorage
    }));
    
    // Method 2: Custom events
    window.dispatchEvent(new CustomEvent('thematicStaysUpdated', { detail: updateData }));
    
    // Method 3: BroadcastChannel for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('thematic-stays-updates');
      channel.postMessage(updateData);
      channel.close();
    }
    
    // Method 4: Notify all listeners
    listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
    
    console.log('Saved thematic stays with version:', newVersion, stays);
  } catch (error) {
    console.error('Error saving thematic stays:', error);
  }
};

export const useThematicStays = () => {
  const [stays, setStays] = useState<ThematicStay[]>(() => {
    const { stays: loadedStays } = loadFromStorage();
    return [...loadedStays];
  });
  const [updateCounter, setUpdateCounter] = useState(0);
  const [currentVersion, setCurrentVersion] = useState(() => globalVersion);

  const forceUpdate = useCallback(() => {
    const { stays: newStays, version } = loadFromStorage();
    
    // Only update if version has changed
    if (version !== currentVersion || JSON.stringify(newStays) !== JSON.stringify(stays)) {
      console.log('Force updating thematic stays - old version:', currentVersion, 'new version:', version);
      setStays([...newStays]);
      setCurrentVersion(version);
      setUpdateCounter(prev => prev + 1);
    }
  }, [currentVersion, stays]);

  const checkForUpdates = useCallback(() => {
    try {
      const savedVersion = localStorage.getItem(VERSION_KEY);
      if (savedVersion) {
        const version = parseInt(savedVersion, 10);
        if (version > currentVersion) {
          console.log('Detected version change, updating...', currentVersion, '->', version);
          forceUpdate();
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }, [currentVersion, forceUpdate]);

  useEffect(() => {
    // Add this component to listeners
    listeners.push(forceUpdate);
    
    // Load initial data
    forceUpdate();

    // Multiple event listeners for robust cross-device updates
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === VERSION_KEY) {
        console.log('Storage change detected:', event.key);
        setTimeout(forceUpdate, 100);
      }
    };

    const handleCustomEvent = (event: CustomEvent) => {
      console.log('Custom thematic stays event received:', event.detail);
      setTimeout(forceUpdate, 100);
    };

    const handleBroadcastMessage = (event: MessageEvent) => {
      console.log('Broadcast message received:', event.data);
      if (event.data.version > currentVersion) {
        setTimeout(forceUpdate, 100);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible, checking for updates');
        setTimeout(checkForUpdates, 200);
      }
    };

    const handleFocus = () => {
      console.log('Window focused, checking for updates');
      setTimeout(checkForUpdates, 200);
    };

    const handlePageShow = () => {
      console.log('Page show event, checking for updates');
      setTimeout(checkForUpdates, 200);
    };

    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('thematicStaysUpdated', handleCustomEvent as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    // BroadcastChannel for cross-tab communication
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('thematic-stays-updates');
      broadcastChannel.addEventListener('message', handleBroadcastMessage);
    }

    // Aggressive polling for mobile devices (every 2 seconds)
    const intervalId = setInterval(() => {
      checkForUpdates();
    }, 2000);

    // Additional mobile-specific checks
    const touchStartHandler = () => setTimeout(checkForUpdates, 300);
    const scrollHandler = () => setTimeout(checkForUpdates, 500);
    
    window.addEventListener('touchstart', touchStartHandler, { passive: true });
    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      // Remove from listeners
      listeners = listeners.filter(listener => listener !== forceUpdate);
      
      // Cleanup event listeners
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('thematicStaysUpdated', handleCustomEvent as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('scroll', scrollHandler);
      
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcastMessage);
        broadcastChannel.close();
      }
      
      clearInterval(intervalId);
    };
  }, [forceUpdate, checkForUpdates, currentVersion]);

  const updateStays = useCallback((newStays: ThematicStay[]) => {
    const newVersion = generateVersion();
    saveToStorage(newStays, newVersion);
    setStays([...newStays]);
    setCurrentVersion(newVersion);
    setUpdateCounter(prev => prev + 1);
  }, []);

  return {
    stays,
    updateStays,
    updateCounter,
    forceUpdate
  };
};
