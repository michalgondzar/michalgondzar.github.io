
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, FileImage } from "lucide-react";
import { ImageUploadDialog } from "./ImageUploadDialog";
import { useOtherImagesManager, OtherImage } from "@/hooks/useOtherImagesManager";

export const OtherImagesManager = () => {
  const [currentImage, setCurrentImage] = useState<OtherImage | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const {
    otherImages,
    isLoading,
    uploadImage,
    deleteImage,
    updateImageField
  } = useOtherImagesManager();

  const openImageDialog = (image: OtherImage | null = null) => {
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
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileImage className="h-5 w-5 text-booking-primary" />
          <h3 className="text-lg font-semibold">Ostatné obrázky na stránke</h3>
        </div>
        <Button 
          onClick={() => openImageDialog()} 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Plus size={16} />
          Pridať obrázok
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherImages.map((image) => (
          <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md bg-gray-50">
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
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
            
            <div className="p-3 space-y-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Názov</label>
                <Input 
                  value={image.name}
                  onChange={(e) => updateImageField(image.id, 'name', e.target.value)}
                  placeholder="Názov obrázka"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Popis</label>
                <Input 
                  value={image.alt}
                  onChange={(e) => updateImageField(image.id, 'alt', e.target.value)}
                  placeholder="Popis obrázka"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Použitie</label>
                <Select 
                  value={image.usage}
                  onValueChange={(value) => updateImageField(image.id, 'usage', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Vyberte použitie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Všeobecné</SelectItem>
                    <SelectItem value="hero-background">Hero pozadie</SelectItem>
                    <SelectItem value="about-section">Sekcia o nás</SelectItem>
                    <SelectItem value="contact-section">Kontaktná sekcia</SelectItem>
                    <SelectItem value="footer">Pätička</SelectItem>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="gallery-background">Pozadie galérie</SelectItem>
                    <SelectItem value="booking-section">Rezervačná sekcia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageUploadDialog 
        isOpen={isImageDialogOpen}
        onClose={closeImageDialog}
        currentImage={currentImage}
        onImageUpload={handleImageUpload}
        isLoading={isLoading}
      />
    </div>
  );
};
