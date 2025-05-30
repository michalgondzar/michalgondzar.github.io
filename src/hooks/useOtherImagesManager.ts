
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
    let currentImages = [...DEFAULT_IMAGES];
    
    if (savedImages) {
      const parsedImages: OtherImage[] = JSON.parse(savedImages);
      console.log('Loading saved images:', parsedImages);
      
      // Aktualizuj predvolené obrázky s uloženými verziami
      currentImages = DEFAULT_IMAGES.map(defaultImg => {
        const savedImg = parsedImages.find(img => img.usage === defaultImg.usage);
        return savedImg || defaultImg;
      });
      
      // Pridaj nové obrázky, ktoré nie sú v predvolených
      const newImages = parsedImages.filter(savedImg => 
        !DEFAULT_IMAGES.find(defaultImg => defaultImg.usage === savedImg.usage)
      );
      currentImages = [...currentImages, ...newImages];
    }
    
    console.log('Current images after merge:', currentImages);
    return currentImages;
  } catch (error) {
    console.error('Error getting current images:', error);
    return [...DEFAULT_IMAGES];
  }
};

// Funkcia na získenie obrázka podľa použitia
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
    setOtherImages(currentImages);
  };

  const saveOtherImages = (images: OtherImage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      console.log('Saved other images to localStorage:', images);
      
      // Trigger custom event pre aktualizáciu komponentov
      console.log('Triggering otherImagesUpdated event');
      const event = new CustomEvent('otherImagesUpdated', { detail: images });
      window.dispatchEvent(event);
      
      // Pridáme krátky timeout a potom spustíme storage event
      setTimeout(() => {
        console.log('Triggering storage event for component refresh');
        window.dispatchEvent(new Event('storage'));
      }, 50);
      
      // Pridáme ešte jeden event špecificky pre force refresh
      setTimeout(() => {
        console.log('Triggering force refresh event');
        window.dispatchEvent(new CustomEvent('forceImageRefresh'));
      }, 100);
      
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
        const newImage: OtherImage = {
          id: Date.now(),
          name: fileName,
          src: imageSrc,
          alt: imageDescription,
          usage: "general",
          category: "general",
          storage_path: storagePath
        };
        
        const currentImages = getCurrentImages();
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
