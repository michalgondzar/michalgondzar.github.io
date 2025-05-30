import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  storage_path?: string;
}

// Upload image to Supabase storage
export const uploadImageToStorage = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set up your Supabase environment variables.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { data, error } = await supabase.storage
    .from('gallery-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('gallery-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Save gallery data to Supabase database
export const saveGalleryToDatabase = async (gallery: GalleryImage[]) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, saving to localStorage instead');
    localStorage.setItem('apartmentGallery', JSON.stringify(gallery));
    return;
  }

  const { error } = await supabase
    .from('gallery')
    .upsert({ 
      id: 1, // Single gallery record
      images: gallery 
    });

  if (error) {
    console.error('Error saving gallery:', error);
    throw error;
  }
};

// Load gallery data from Supabase database
export const loadGalleryFromDatabase = async (): Promise<GalleryImage[]> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, loading from localStorage instead');
    const savedGallery = localStorage.getItem('apartmentGallery');
    if (savedGallery) {
      try {
        return JSON.parse(savedGallery);
      } catch (error) {
        console.error('Error parsing localStorage gallery:', error);
      }
    }
    return [];
  }

  const { data, error } = await supabase
    .from('gallery')
    .select('images')
    .eq('id', 1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found, return empty array
      return [];
    }
    console.error('Error loading gallery:', error);
    throw error;
  }

  return data?.images || [];
};

// Delete image from storage
export const deleteImageFromStorage = async (storagePath: string) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, cannot delete from storage');
    return;
  }

  if (!storagePath) return;
  
  const { error } = await supabase.storage
    .from('gallery-images')
    .remove([storagePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
