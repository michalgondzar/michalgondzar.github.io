import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Trash, Plus, Upload, Download, FileUp, HardDrive } from "lucide-react";
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

export const GalleryManager = () => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, percentage: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Load gallery from Supabase on component mount
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

  const openImageDialog = (image: GalleryImage | null = null) => {
    setCurrentImage(image);
    setIsImageDialogOpen(true);
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let imageSrc: string;
      let storagePath: string | undefined;

      if (isSupabaseConfigured) {
        // Upload to Supabase storage
        imageSrc = await uploadImageToStorage(file);
        storagePath = imageSrc.split('/').pop();
      } else {
        // Komprimovať obrázok pre lokálne ukladanie
        imageSrc = await compressImage(file, 0.7);
        console.log('Obrázok komprimovaný pre lokálne ukladanie');
      }
      
      const newImage: GalleryImage = {
        id: Date.now(),
        src: imageSrc,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        category: "interior",
        storage_path: storagePath
      };
      
      let updatedGallery: GalleryImage[];
      if (currentImage) {
        // Delete old image from storage if updating and Supabase is configured
        if (currentImage.storage_path && isSupabaseConfigured) {
          await deleteImageFromStorage(currentImage.storage_path);
        }
        
        updatedGallery = gallery.map(img => 
          img.id === currentImage.id ? {...img, src: newImage.src, storage_path: newImage.storage_path} : img
        );
        toast.success("Obrázok bol aktualizovaný");
      } else {
        updatedGallery = [...gallery, newImage];
        toast.success("Obrázok bol pridaný a komprimovaný");
      }
      
      setGallery(updatedGallery);
      await saveGallery(updatedGallery);
      setIsImageDialogOpen(false);
      setCurrentImage(null);
      updateStorageUsage();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Chyba pri nahrávaní obrázka");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportGallery = () => {
    try {
      exportGalleryToFile(gallery);
      toast.success("Galéria bola exportovaná");
    } catch (error) {
      console.error('Error exporting gallery:', error);
      toast.error("Chyba pri exportovaní galérie");
    }
  };

  const handleImportGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedGallery = await importGalleryFromFile(file);
      setGallery(importedGallery);
      await saveGallery(importedGallery);
      updateStorageUsage();
      toast.success(`Galéria bola importovaná (${importedGallery.length} obrázkov)`);
      setIsImportDialogOpen(false);
      
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing gallery:', error);
      toast.error("Chyba pri importovaní galérie");
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
    const updatedGallery = gallery.map(img => 
      img.id === id ? {...img, alt: newAlt} : img
    );
    setGallery(updatedGallery);
    await saveGallery(updatedGallery);
  };

  const updateImageCategory = async (id: number, newCategory: string) => {
    const updatedGallery = gallery.map(img => 
      img.id === id ? {...img, category: newCategory} : img
    );
    setGallery(updatedGallery);
    await saveGallery(updatedGallery);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Spravovať fotogalériu</h2>
          {!isSupabaseConfigured && (
            <div className="text-sm text-orange-600 mt-1 space-y-1">
              <p>Supabase nie je nakonfigurovaný - obrázky sa ukladajú lokálne</p>
              <div className="flex items-center gap-2">
                <HardDrive size={14} />
                <span>Využitie úložiska: {storageUsage.used.toFixed(2)} MB ({storageUsage.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!isSupabaseConfigured && (
            <>
              <Button 
                variant="outline"
                onClick={handleExportGallery}
                className="flex items-center gap-2"
                disabled={gallery.length === 0}
              >
                <Download size={16} />
                Export
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsImportDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <FileUp size={16} />
                Import
              </Button>
            </>
          )}
          <Button 
            onClick={() => openImageDialog()} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus size={16} />
            Pridať obrázok
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gallery.map((image) => (
          <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md">
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
            />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => openImageDialog(image)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteImage(image.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-white space-y-2">
              <Input 
                value={image.alt}
                onChange={(e) => updateImageAlt(image.id, e.target.value)}
                placeholder="Popis obrázka"
              />
              <select 
                value={image.category}
                onChange={(e) => updateImageCategory(image.id, e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="interior">Interiér</option>
                <option value="exterior">Exteriér</option>
                <option value="surroundings">Okolie</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importovať galériu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vyberte JSON súbor s galériou. Existujúce obrázky budú nahradené.
            </p>
            <Input 
              type="file" 
              accept=".json"
              ref={importFileInputRef}
              onChange={handleImportGallery}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(false)}
            >
              Zrušiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentImage ? "Upraviť obrázok" : "Nahrať nový obrázok"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentImage && (
              <div className="rounded-md overflow-hidden">
                <img 
                  src={currentImage.src} 
                  alt={currentImage.alt}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vyberte obrázok
              </label>
              <Input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsImageDialogOpen(false);
                setCurrentImage(null);
              }}
              disabled={isLoading}
            >
              Zrušiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
