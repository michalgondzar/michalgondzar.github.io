
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, FileImage } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadDialog } from "./ImageUploadDialog";

interface OtherImage {
  id: number;
  name: string;
  src: string;
  alt: string;
  usage: string; // Where this image is used (e.g., "hero-background", "about-section", etc.)
}

export const OtherImagesManager = () => {
  const [otherImages, setOtherImages] = useState<OtherImage[]>([
    {
      id: 1,
      name: "Hero pozadie",
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      alt: "Pozadie hlavnej sekcie",
      usage: "hero-background"
    },
    {
      id: 2,
      name: "O nás obrázok", 
      src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      alt: "Obrázok v sekcii o nás",
      usage: "about-section"
    }
  ]);
  
  const [currentImage, setCurrentImage] = useState<OtherImage | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openImageDialog = (image: OtherImage | null = null) => {
    setCurrentImage(image);
    setIsImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
    setCurrentImage(null);
  };

  const handleImageUpload = async (file: File, description?: string) => {
    setIsLoading(true);
    try {
      // Create a data URL for the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const imageDescription = description || fileName;
        
        const newImage: OtherImage = {
          id: Date.now(),
          name: fileName,
          src: imageSrc,
          alt: imageDescription,
          usage: "general"
        };
        
        if (currentImage) {
          setOtherImages(images => 
            images.map(img => 
              img.id === currentImage.id 
                ? {...img, src: newImage.src, alt: newImage.alt, name: newImage.name}
                : img
            )
          );
          toast.success("Obrázok bol aktualizovaný");
        } else {
          setOtherImages(images => [...images, newImage]);
          toast.success("Obrázok bol pridaný");
        }
        
        closeImageDialog();
      };
      reader.readAsDataURL(file);
      
      return true;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Chyba pri nahrávaní obrázka");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = (id: number) => {
    if (!confirm("Naozaj chcete odstrániť tento obrázok?")) return;
    
    setOtherImages(images => images.filter(img => img.id !== id));
    toast.success("Obrázok bol odstránený");
  };

  const updateImageField = (id: number, field: keyof OtherImage, value: string) => {
    setOtherImages(images => 
      images.map(img => 
        img.id === id ? {...img, [field]: value} : img
      )
    );
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
                <select 
                  value={image.usage}
                  onChange={(e) => updateImageField(image.id, 'usage', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="general">Všeobecné</option>
                  <option value="hero-background">Hero pozadie</option>
                  <option value="about-section">Sekcia o nás</option>
                  <option value="contact-section">Kontaktná sekcia</option>
                  <option value="footer">Pätička</option>
                  <option value="logo">Logo</option>
                </select>
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
