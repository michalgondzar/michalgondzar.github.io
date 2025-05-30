import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  uploadImageToStorage, 
  deleteImageFromStorage,
} from "@/utils/supabaseGallery";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { compressImage } from "@/utils/localImageUtils";

export interface OtherImage {
  id: number;
  name: string;
  src: string;
  alt: string;
  usage: string;
  category: string;
  storage_path?: string;
}

const STORAGE_KEY = 'apartmentOtherImages';

// Predvolené obrázky
const DEFAULT_IMAGES: OtherImage[] = [
  {
    id: 1,
    name: "Hero pozadie",
    src: "/lovable-uploads/d06dc388-6dfa-46a9-8263-6df056d17698.png",
    alt: "Pozadie hlavnej sekcie",
    usage: "hero-background",
    category: "general"
  },
  {
    id: 2,
    name: "Logo apartmánu", 
    src: "",
    alt: "Logo Apartmán Tília",
    usage: "logo",
    category: "general"
  },
  {
    id: 3,
    name: "O nás obrázok", 
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    alt: "Obrázok v sekcii o nás",
    usage: "about-section",
    category: "general"
  },
  {
    id: 4,
    name: "Kontakt pozadie", 
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    alt: "Pozadie kontaktnej sekcie",
    usage: "contact-section",
    category: "general"
  },
  {
    id: 5,
    name: "Footer pozadie", 
    src: "",
    alt: "Pozadie pätičky",
    usage: "footer-background",
    category: "general"
  },
  {
    id: 6,
    name: "Galéria pozadie", 
    src: "",
    alt: "Pozadie galérie",
    usage: "gallery-background",
    category: "general"
  },
  {
    id: 7,
    name: "Rezervácia pozadie", 
    src: "",
    alt: "Pozadie rezervačnej sekcie",
    usage: "booking-section",
    category: "general"
  },
  {
    id: 8,
    name: "Exteriér apartmánu",
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    alt: "Vonkajší pohľad na apartmán",
    usage: "apartment-exterior",
    category: "general"
  },
  {
    id: 9,
    name: "Interiér apartmánu",
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    alt: "Vnútorný pohľad na apartmán",
    usage: "apartment-interior",
    category: "general"
  },
  {
    id: 10,
    name: "Aquapark Bešeňová",
    src: "https://images.unsplash.com/photo-1577880216142-8549e9488dad",
    alt: "Aquapark Bešeňová v blízkosti apartmánu",
    usage: "aquapark-bešeňová",
    category: "general"
  },
  {
    id: 11,
    name: "Mapa lokality",
    src: "https://images.unsplash.com/photo-1524661135-423995f22d0b",
    alt: "Mapa s umiestnením apartmánu",
    usage: "location-map",
    category: "general"
  },
  {
    id: 12,
    name: "Navbar pozadie",
    src: "",
    alt: "Pozadie navigácie",
    usage: "navbar-background",
    category: "general"
  },
  {
    id: 13,
    name: "Popis pozadie",
    src: "",
    alt: "Pozadie sekcie popisu",
    usage: "description-background",
    category: "general"
  },
  {
    id: 14,
    name: "Manželské pobyty pozadie",
    src: "",
    alt: "Pozadie sekcie manželských pobytov",
    usage: "marital-stays-background",
    category: "general"
  },
  {
    id: 15,
    name: "Galéria hero",
    src: "",
    alt: "Hero obrázok galérie",
    usage: "gallery-hero",
    category: "general"
  },
  {
    id: 16,
    name: "Kontakt hero",
    src: "",
    alt: "Hero obrázok kontaktu",
    usage: "contact-hero",
    category: "general"
  }
];

// Funkcia na získanie aktuálnych obrázkov s predvolenými ako základom
const getCurrentImages = (): OtherImage[] => {
  try {
    const savedImages = localStorage.getItem(STORAGE_KEY);
    
    if (savedImages) {
      const parsedImages: OtherImage[] = JSON.parse(savedImages);
      console.log('getCurrentImages: Loading saved images from localStorage:', parsedImages.length);
      return parsedImages;
    } else {
      console.log('getCurrentImages: No saved images found, using defaults');
      return [...DEFAULT_IMAGES];
    }
  } catch (error) {
    console.error('getCurrentImages: Error getting current images:', error);
    return [...DEFAULT_IMAGES];
  }
};

// Funkcia na získanie obrázka podľa použitia
export const getImageByUsage = (usage: string): string => {
  const images = getCurrentImages();
  const image = images.find(img => img.usage === usage);
  console.log(`getImageByUsage: Getting image for usage "${usage}":`, image?.src || 'not found');
  return image?.src || '';
};

export const useOtherImagesManager = () => {
  const [otherImages, setOtherImages] = useState<OtherImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOtherImages = () => {
    console.log('loadOtherImages: Starting to load images...');
    try {
      const currentImages = getCurrentImages();
      console.log('loadOtherImages: Loaded images:', currentImages.length, currentImages);
      setOtherImages(currentImages);
    } catch (error) {
      console.error('loadOtherImages: Error loading images:', error);
      const defaultImages = [...DEFAULT_IMAGES];
      console.log('loadOtherImages: Using default images:', defaultImages.length);
      setOtherImages(defaultImages);
    }
  };

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log('=== DEBUG LOCALSTORAGE START ===');
    const data = localStorage.getItem(STORAGE_KEY);
    console.log('Raw localStorage data for', STORAGE_KEY, ':', data);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('Parsed data:', parsed);
        console.log('Number of images in localStorage:', parsed.length);
        console.log('Images with src:', parsed.filter((img: OtherImage) => img.src).length);
        parsed.forEach((img: OtherImage, index: number) => {
          console.log(`Image ${index + 1}:`, {
            id: img.id,
            name: img.name,
            usage: img.usage,
            hasSrc: !!img.src,
            src: img.src ? img.src.substring(0, 50) + '...' : 'empty'
          });
        });
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    } else {
      console.log('No data found in localStorage for key:', STORAGE_KEY);
    }
    console.log('Current otherImages state:', otherImages.length);
    console.log('=== DEBUG LOCALSTORAGE END ===');
  };

  useEffect(() => {
    console.log('useOtherImagesManager: Component mounted, loading images...');
    loadOtherImages();
    
    // Force reload after a short delay to ensure localStorage is accessible
    const timer = setTimeout(() => {
      console.log('useOtherImagesManager: Force reloading images after delay...');
      loadOtherImages();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Listen for storage events
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('useOtherImagesManager: Storage changed, reloading images...');
      loadOtherImages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('otherImagesUpdated', handleStorageChange);
    window.addEventListener('forceImageRefresh', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('otherImagesUpdated', handleStorageChange);
      window.removeEventListener('forceImageRefresh', handleStorageChange);
    };
  }, []);

  const saveOtherImages = (images: OtherImage[]) => {
    try {
      console.log('saveOtherImages: Saving images to localStorage:', images.length);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      console.log('saveOtherImages: Images saved successfully');
      
      // Trigger events for component refresh
      const customEvent = new CustomEvent('otherImagesUpdated', { detail: images });
      window.dispatchEvent(customEvent);
      
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 50);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('forceImageRefresh'));
      }, 100);
      
    } catch (error) {
      console.error('saveOtherImages: Error saving other images:', error);
      toast.error("Chyba pri ukladaní obrázkov");
    }
  };

  const uploadImage = async (file: File, description?: string, currentImage?: OtherImage | null) => {
    setIsLoading(true);
    try {
      let imageSrc: string;
      let storagePath: string | undefined;

      if (isSupabaseConfigured) {
        console.log('Uploading to Supabase storage...');
        imageSrc = await uploadImageToStorage(file);
        const urlParts = imageSrc.split('/');
        const objectPath = urlParts.slice(-2).join('/');
        storagePath = objectPath;
        console.log('Storage path extracted:', storagePath);
      } else {
        imageSrc = await compressImage(file, 0.7);
        console.log('Obrázok komprimovaný pre lokálne ukladanie');
      }
      
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const imageDescription = description || fileName;
      
      let updatedImages: OtherImage[];
      
      if (currentImage) {
        // Aktualizácia existujúceho obrázka
        if (currentImage.storage_path && isSupabaseConfigured) {
          await deleteImageFromStorage(currentImage.storage_path);
        }
        
        const currentImages = getCurrentImages();
        updatedImages = currentImages.map(img => 
          img.id === currentImage.id 
            ? {...img, src: imageSrc, alt: imageDescription, name: fileName, storage_path: storagePath}
            : img
        );
        toast.success("Obrázok bol aktualizovaný");
      } else {
        // Pridanie nového obrázka
        const currentImages = getCurrentImages();
        const newId = Math.max(...currentImages.map(img => img.id), 0) + 1;
        
        const newImage: OtherImage = {
          id: newId,
          name: fileName,
          src: imageSrc,
          alt: imageDescription,
          usage: "general",
          category: "general",
          storage_path: storagePath
        };
        
        updatedImages = [...currentImages, newImage];
        toast.success("Obrázok bol pridaný");
      }
      
      setOtherImages(updatedImages);
      saveOtherImages(updatedImages);
      
      return true;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Chyba pri nahrávaní obrázka: " + (error as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Naozaj chcete odstrániť tento obrázok?")) return;
    
    try {
      const currentImages = getCurrentImages();
      const imageToDelete = currentImages.find(img => img.id === id);
      
      if (imageToDelete?.storage_path && isSupabaseConfigured) {
        await deleteImageFromStorage(imageToDelete.storage_path);
      }
      
      const updatedImages = currentImages.filter(img => img.id !== id);
      setOtherImages(updatedImages);
      saveOtherImages(updatedImages);
      toast.success("Obrázok bol odstránený");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Chyba pri odstraňovaní obrázka");
    }
  };

  const updateImageField = (id: number, field: keyof OtherImage, value: string) => {
    const currentImages = getCurrentImages();
    const updatedImages = currentImages.map(img => 
      img.id === id ? {...img, [field]: value} : img
    );
    setOtherImages(updatedImages);
    saveOtherImages(updatedImages);
  };

  return {
    otherImages,
    isLoading,
    uploadImage,
    deleteImage,
    updateImageField,
    loadOtherImages,
    debugLocalStorage
  };
};
