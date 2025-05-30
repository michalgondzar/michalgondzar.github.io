
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
      console.log('Loading all saved images from localStorage:', parsedImages);
      
      // Vráť všetky uložené obrázky - už obsahujú aj aktualizované predvolené
      return parsedImages;
    } else {
      console.log('No saved images found, using defaults');
      return [...DEFAULT_IMAGES];
    }
  } catch (error) {
    console.error('Error getting current images:', error);
    return [...DEFAULT_IMAGES];
  }
};

// Funkcia na získanie obrázka podľa použitia
export const getImageByUsage = (usage: string): string => {
  const images = getCurrentImages();
  const image = images.find(img => img.usage === usage);
  console.log(`Getting image for usage "${usage}":`, image?.src || 'not found');
  return image?.src || '';
};

export const useOtherImagesManager = () => {
  const [otherImages, setOtherImages] = useState<OtherImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOtherImages();
  }, []);

  const loadOtherImages = () => {
    const currentImages = getCurrentImages();
    console.log('Loading images for admin panel:', currentImages);
    setOtherImages(currentImages);
  };

  const saveOtherImages = (images: OtherImage[]) => {
    try {
      // Uložíme kompletný zoznam obrázkov
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      console.log('Saved complete image list to localStorage:', images);
      
      // Trigger všetky možné eventy pre maximálnu kompatibilitu
      console.log('Triggering otherImagesUpdated event');
      const customEvent = new CustomEvent('otherImagesUpdated', { detail: images });
      window.dispatchEvent(customEvent);
      
      // Storage event pre komponenty ktoré ho používajú
      setTimeout(() => {
        console.log('Triggering storage event for component refresh');
        window.dispatchEvent(new Event('storage'));
      }, 50);
      
      // Force refresh event pre komponenty
      setTimeout(() => {
        console.log('Triggering force refresh event');
        window.dispatchEvent(new CustomEvent('forceImageRefresh'));
      }, 100);
      
      // Pridáme aj document event pre cross-page komunikáciu
      setTimeout(() => {
        console.log('Triggering document-level image update event');
        document.dispatchEvent(new CustomEvent('globalImageUpdate', { detail: images }));
      }, 150);
      
    } catch (error) {
      console.error('Error saving other images:', error);
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
        
        // Získaj aktuálne obrázky a aktualizuj konkrétny
        const currentImages = getCurrentImages();
        updatedImages = currentImages.map(img => 
          img.id === currentImage.id 
            ? {...img, src: imageSrc, alt: imageDescription, name: fileName, storage_path: storagePath}
            : img
        );
        console.log('Updated existing image, new images array:', updatedImages);
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
        console.log('Added new image:', newImage);
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
      console.log('Deleted image with id:', id);
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
    console.log('Updating image field:', field, 'for image:', id, 'new value:', value);
    console.log('Updated images array:', updatedImages);
    setOtherImages(updatedImages);
    saveOtherImages(updatedImages);
  };

  return {
    otherImages,
    isLoading,
    uploadImage,
    deleteImage,
    updateImageField
  };
};
