
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
const CHANGE_EVENT = 'thematicStaysChanged';

// Globálny stav pre synchronizáciu
let globalStays: ThematicStay[] = DEFAULT_STAYS;
let globalVersion = 0;
let subscribers: (() => void)[] = [];

// Broadcast channel pre cross-tab komunikáciu
let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel('thematic-stays-sync');
} catch (error) {
  console.log('BroadcastChannel not supported');
}

const notifySubscribers = () => {
  subscribers.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Error in subscriber callback:', error);
    }
  });
};

const saveStays = (stays: ThematicStay[]) => {
  const version = Date.now();
  const dataToSave = {
    stays,
    version,
    timestamp: version
  };
  
  // Uloženie do localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  
  // Aktualizácia globálneho stavu
  globalStays = stays;
  globalVersion = version;
  
  // Oznámenie cez BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'update', data: dataToSave });
  }
  
  // Custom event pre starší prehliadače
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { 
    detail: dataToSave 
  }));
  
  // Storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: JSON.stringify(dataToSave),
    storageArea: localStorage
  }));
  
  // Notify subscribers
  notifySubscribers();
  
  console.log('Thematic stays saved with version:', version);
};

const loadStays = (): { stays: ThematicStay[], version: number } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.stays && parsed.version) {
        globalStays = parsed.stays;
        globalVersion = parsed.version;
        return { stays: parsed.stays, version: parsed.version };
      }
    }
  } catch (error) {
    console.error('Error loading thematic stays:', error);
  }
  
  // Return defaults
  globalStays = DEFAULT_STAYS;
  globalVersion = Date.now();
  return { stays: DEFAULT_STAYS, version: globalVersion };
};

export const useThematicStaysSync = () => {
  const [stays, setStays] = useState<ThematicStay[]>(() => {
    const { stays: loadedStays } = loadStays();
    return [...loadedStays];
  });
  const [version, setVersion] = useState(() => globalVersion);
  const [updateCounter, setUpdateCounter] = useState(0);

  const checkForUpdates = useCallback(() => {
    const { stays: newStays, version: newVersion } = loadStays();
    
    if (newVersion > version) {
      console.log('Update detected:', newVersion, '>', version);
      setStays([...newStays]);
      setVersion(newVersion);
      setUpdateCounter(prev => prev + 1);
      return true;
    }
    return false;
  }, [version]);

  const forceUpdate = useCallback(() => {
    const { stays: newStays, version: newVersion } = loadStays();
    console.log('Force update triggered');
    setStays([...newStays]);
    setVersion(newVersion);
    setUpdateCounter(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Pridanie do subscribers
    subscribers.push(forceUpdate);
    
    // BroadcastChannel listener
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data.type === 'update') {
        console.log('Broadcast message received');
        setTimeout(checkForUpdates, 100);
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcastMessage);
    }
    
    // Storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        console.log('Storage change detected');
        setTimeout(checkForUpdates, 100);
      }
    };
    
    // Custom event listener
    const handleCustomEvent = (event: CustomEvent) => {
      console.log('Custom event received');
      setTimeout(checkForUpdates, 100);
    };
    
    // Visibility change listener
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, checking for updates');
        setTimeout(checkForUpdates, 200);
      }
    };
    
    // Focus listener
    const handleFocus = () => {
      console.log('Window focused, checking for updates');
      setTimeout(checkForUpdates, 200);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CHANGE_EVENT, handleCustomEvent as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Polling pre mobily a starší prehliadače
    const interval = setInterval(checkForUpdates, 2000);
    
    return () => {
      subscribers = subscribers.filter(sub => sub !== forceUpdate);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcastMessage);
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CHANGE_EVENT, handleCustomEvent as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [forceUpdate, checkForUpdates]);

  const updateStays = useCallback((newStays: ThematicStay[]) => {
    saveStays(newStays);
    setStays([...newStays]);
    setUpdateCounter(prev => prev + 1);
  }, []);

  return {
    stays,
    updateStays,
    updateCounter,
    forceUpdate,
    version
  };
};
