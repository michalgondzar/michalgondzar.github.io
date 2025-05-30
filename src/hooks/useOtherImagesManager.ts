
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

export const useOtherImagesManager = () => {
  const [otherImages, setOtherImages] = useState<OtherImage[]>([
    {
      id: 1,
      name: "Hero pozadie",
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      alt: "Pozadie hlavnej sekcie",
      usage: "hero-background",
      category: "general"
    },
    {
      id: 2,
      name: "O nás obrázok", 
      src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      alt: "Obrázok v sekcii o nás",
      usage: "about-section",
      category: "general"
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOtherImages();
  }, []);

  const loadOtherImages = () => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        setOtherImages(parsedImages);
        console.log('Loaded other images from localStorage:', parsedImages);
      }
    } catch (error) {
      console.error('Error loading other images:', error);
    }
  };

  const saveOtherImages = (images: OtherImage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      console.log('Saved other images to localStorage:', images);
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
