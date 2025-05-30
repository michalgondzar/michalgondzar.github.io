import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  uploadImageToStorage, 
  saveGalleryToDatabase, 
  loadGalleryFromDatabase, 
  deleteImageFromStorage,
  GalleryImage 
} from "@/utils/supabaseGallery";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { 
  compressImage, 
  exportGalleryToFile, 
  importGalleryFromFile, 
  getStorageUsage 
} from "@/utils/localImageUtils";

export const useGalleryManager = () => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, percentage: 0 });

  useEffect(() => {
    loadGallery();
    updateStorageUsage();
  }, []);

  const updateStorageUsage = () => {
    if (!isSupabaseConfigured) {
      setStorageUsage(getStorageUsage());
    }
  };

  const loadGallery = async () => {
    try {
      const galleryData = await loadGalleryFromDatabase();
      setGallery(galleryData);
      console.log('Loaded gallery from database/localStorage:', galleryData);
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error("Chyba pri načítavaní galérie");
    }
  };

  const saveGallery = async (updatedGallery: GalleryImage[]) => {
    try {
      await saveGalleryToDatabase(updatedGallery);
      console.log('Saved gallery:', updatedGallery);
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast.error("Chyba pri ukladaní galérie");
    }
  };

  const uploadImage = async (file: File, description?: string, currentImage?: GalleryImage | null) => {
    setIsLoading(true);
    try {
      let imageSrc: string;
      let storagePath: string | undefined;

      if (isSupabaseConfigured) {
        console.log('Uploading to Supabase storage...');
        imageSrc = await uploadImageToStorage(file);
        // Extract storage path from URL for Supabase
        const urlParts = imageSrc.split('/');
        const objectPath = urlParts.slice(-2).join('/'); // gets "gallery/filename.ext"
        storagePath = objectPath;
        console.log('Storage path extracted:', storagePath);
      } else {
        imageSrc = await compressImage(file, 0.7);
        console.log('Obrázok komprimovaný pre lokálne ukladanie');
      }
      
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const imageDescription = description || fileName;
      
      const newImage: GalleryImage = {
        id: Date.now(),
        src: imageSrc,
        alt: imageDescription,
        name: fileName,
        category: "interior",
        storage_path: storagePath
      };
      
      let updatedGallery: GalleryImage[];
      if (currentImage) {
        if (currentImage.storage_path && isSupabaseConfigured) {
          await deleteImageFromStorage(currentImage.storage_path);
        }
        
        updatedGallery = gallery.map(img => 
          img.id === currentImage.id ? {...img, src: newImage.src, alt: newImage.alt, storage_path: newImage.storage_path} : img
        );
        toast.success("Obrázok bol aktualizovaný");
      } else {
        updatedGallery = [...gallery, newImage];
        toast.success("Obrázok bol pridaný");
      }
      
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
      updateStorageUsage();
      
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
      const imageToDelete = gallery.find(img => img.id === id);
      if (imageToDelete?.storage_path && isSupabaseConfigured) {
        await deleteImageFromStorage(imageToDelete.storage_path);
      }
      
      const updatedGallery = gallery.filter(img => img.id !== id);
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
      toast.success("Obrázok bol odstránený");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Chyba pri odstraňovaní obrázka");
    }
  };

  const updateImageAlt = async (id: number, newAlt: string) => {
    console.log('updateImageAlt called with:', { id, newAlt });
    try {
      const updatedGallery = gallery.map(img => 
        img.id === id ? {...img, alt: newAlt} : img
      );
      console.log('Updated gallery with new alt:', updatedGallery);
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
      console.log('Alt text saved successfully');
    } catch (error) {
      console.error('Error updating alt text:', error);
      toast.error("Chyba pri aktualizácii popisu");
    }
  };

  const updateImageCategory = async (id: number, newCategory: string) => {
    console.log('updateImageCategory called with:', { id, newCategory });
    try {
      const updatedGallery = gallery.map(img => 
        img.id === id ? {...img, category: newCategory} : img
      );
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Chyba pri aktualizácii kategórie");
    }
  };

  const updateImageName = async (id: number, newName: string) => {
    console.log('updateImageName called with:', { id, newName });
    try {
      const updatedGallery = gallery.map(img => 
        img.id === id ? {...img, name: newName} : img
      );
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error("Chyba pri aktualizácii názvu");
    }
  };

  const exportGallery = () => {
    try {
      exportGalleryToFile(gallery);
      toast.success("Galéria bola exportovaná");
    } catch (error) {
      console.error('Error exporting gallery:', error);
      toast.error("Chyba pri exportovaní galérie");
    }
  };

  const importGallery = async (file: File) => {
    try {
      const importedGallery = await importGalleryFromFile(file);
      setGallery(importedGallery);
      await saveGallery(importedGallery);
      updateStorageUsage();
      toast.success(`Galéria bola importovaná (${importedGallery.length} obrázkov)`);
      return true;
    } catch (error) {
      console.error('Error importing gallery:', error);
      toast.error("Chyba pri importovaní galérie");
      return false;
    }
  };

  return {
    gallery,
    isLoading,
    storageUsage,
    uploadImage,
    deleteImage,
    updateImageAlt,
    updateImageCategory,
    updateImageName,
    exportGallery,
    importGallery
  };
};
