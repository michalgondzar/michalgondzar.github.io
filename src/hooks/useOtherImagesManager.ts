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

// Funkcia na získenie obrázka podľa použitia
export const getImageByUsage = (usage: string): string => {
  try {
    const savedImages = localStorage.getItem(STORAGE_KEY);
    let images: OtherImage[] = DEFAULT_IMAGES;
    
    if (savedImages) {
      const parsedImages: OtherImage[] = JSON.parse(savedImages);
      // Zlúčenie uložených obrázkov s predvolenými
      images = DEFAULT_IMAGES.map(defaultImg => {
        const savedImg = parsedImages.find(img => img.usage === defaultImg.usage);
        return savedImg || defaultImg;
      });
    }
    
    const image = images.find(img => img.usage === usage);
    if (image) {
      return image.src;
    }
  } catch (error) {
    console.error('Error getting image by usage:', error);
  }
  
  // Fallback na pôvodné obrázky
  const fallbackImages: Record<string, string> = {
    'hero-background': '/lovable-uploads/d06dc388-6dfa-46a9-8263-6df056d17698.png',
    'logo': '',
    'about-section': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'contact-section': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    'footer-background': '',
    'gallery-background': '',
    'booking-section': '',
    'apartment-exterior': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    'apartment-interior': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'aquapark-bešeňová': 'https://images.unsplash.com/photo-1577880216142-8549e9488dad',
    'location-map': 'https://images.unsplash.com/photo-1524661135-423995f22d0b',
    'navbar-background': '',
    'description-background': '',
    'marital-stays-background': '',
    'gallery-hero': '',
    'contact-hero': ''
  };
  
  return fallbackImages[usage] || '';
};

export const useOtherImagesManager = () => {
  const [otherImages, setOtherImages] = useState<OtherImage[]>(DEFAULT_IMAGES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOtherImages();
  }, []);

  const loadOtherImages = () => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY);
      if (savedImages) {
        const parsedImages: OtherImage[] = JSON.parse(savedImages);
        console.log('Loaded saved images from localStorage:', parsedImages);
        
        // Zlúčenie uložených obrázkov s predvolenými - predvolené majú prioritu pre štruktúru
        const mergedImages = DEFAULT_IMAGES.map(defaultImg => {
          const savedImg = parsedImages.find(img => img.usage === defaultImg.usage);
          return savedImg || defaultImg;
        });
        
        // Pridanie nových obrázkov, ktoré nie sú v predvolených
        const newImages = parsedImages.filter(savedImg => 
          !DEFAULT_IMAGES.find(defaultImg => defaultImg.usage === savedImg.usage)
        );
        
        const finalImages = [...mergedImages, ...newImages];
        setOtherImages(finalImages);
        console.log('Final merged images:', finalImages);
      } else {
        console.log('No saved images, using defaults');
        setOtherImages(DEFAULT_IMAGES);
      }
    } catch (error) {
      console.error('Error loading other images:', error);
      setOtherImages(DEFAULT_IMAGES);
    }
  };

  const saveOtherImages = (images: OtherImage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      console.log('Saved other images to localStorage:', images);
      
      // Trigger custom event pre aktualizáciu komponentov
      window.dispatchEvent(new CustomEvent('otherImagesUpdated', { detail: images }));
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
      
      const newImage: OtherImage = {
        id: Date.now(),
        name: fileName,
        src: imageSrc,
        alt: imageDescription,
        usage: "general",
        category: "general",
        storage_path: storagePath
      };
      
      let updatedImages: OtherImage[];
      if (currentImage) {
        if (currentImage.storage_path && isSupabaseConfigured) {
          await deleteImageFromStorage(currentImage.storage_path);
        }
        
        updatedImages = otherImages.map(img => 
          img.id === currentImage.id 
            ? {...img, src: newImage.src, alt: newImage.alt, name: newImage.name, storage_path: newImage.storage_path}
            : img
        );
        toast.success("Obrázok bol aktualizovaný");
      } else {
        updatedImages = [...otherImages, newImage];
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
      const imageToDelete = otherImages.find(img => img.id === id);
      if (imageToDelete?.storage_path && isSupabaseConfigured) {
        await deleteImageFromStorage(imageToDelete.storage_path);
      }
      
      const updatedImages = otherImages.filter(img => img.id !== id);
      setOtherImages(updatedImages);
      saveOtherImages(updatedImages);
      toast.success("Obrázok bol odstránený");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Chyba pri odstraňovaní obrázka");
    }
  };

  const updateImageField = (id: number, field: keyof OtherImage, value: string) => {
    const updatedImages = otherImages.map(img => 
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
    updateImageField
  };
};
