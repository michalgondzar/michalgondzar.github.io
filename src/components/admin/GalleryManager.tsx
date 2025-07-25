import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileUp } from "lucide-react";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { GalleryImage } from "@/utils/supabaseGallery";
import { useGalleryManager } from "@/hooks/useGalleryManager";
import { StorageUsageDisplay } from "./StorageUsageDisplay";
import { GalleryGrid } from "./GalleryGrid";
import { ImageUploadDialog } from "./ImageUploadDialog";
import { ImportGalleryDialog } from "./ImportGalleryDialog";
import { OtherImagesManager } from "./OtherImagesManager";

export const GalleryManager = () => {
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const {
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
  } = useGalleryManager();

  const openImageDialog = (image: GalleryImage | null = null) => {
    setCurrentImage(image);
    setIsImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
    setCurrentImage(null);
  };

  const handleImageUpload = async (file: File, description?: string) => {
    return await uploadImage(file, description, currentImage);
  };

  return (
    <div className="space-y-6">
      {/* Main Gallery Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Fotogaléria apartmánu</h2>
            {!isSupabaseConfigured && (
              <StorageUsageDisplay storageUsage={storageUsage} />
            )}
          </div>
          <div className="flex gap-2">
            {!isSupabaseConfigured && (
              <>
                <Button 
                  variant="outline"
                  onClick={exportGallery}
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
        
        <GalleryGrid 
          gallery={gallery}
          onEditImage={openImageDialog}
          onDeleteImage={deleteImage}
          onUpdateImageAlt={updateImageAlt}
          onUpdateImageCategory={updateImageCategory}
          onUpdateImageName={updateImageName}
        />

        <ImportGalleryDialog 
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onImportGallery={importGallery}
        />

        <ImageUploadDialog 
          isOpen={isImageDialogOpen}
          onClose={closeImageDialog}
          currentImage={currentImage}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />
      </div>

      {/* Other Images Section */}
      <OtherImagesManager />
    </div>
  );
};
