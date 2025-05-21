
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Trash, Plus } from "lucide-react";

// Typ pre obrázok
interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

export const GalleryManager = () => {
  const [gallery, setGallery] = useState<ImageItem[]>([
    { id: 1, src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", alt: "Apartmán obývačka" },
    { id: 2, src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a", alt: "Apartmán kuchyňa" },
    { id: 3, src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd", alt: "Apartmán spálňa" },
    { id: 4, src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", alt: "Apartmán kúpeľňa" },
    { id: 5, src: "https://images.unsplash.com/photo-1610123598195-a6e2652d22fc", alt: "Apartmán terasa" }
  ]);
  const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Referencia pre upload súborov
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openImageDialog = (image: ImageItem | null = null) => {
    setCurrentImage(image);
    setIsImageDialogOpen(true);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // V reálnej aplikácii by sa tu nahrával súbor na server
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: gallery.length + 1,
          src: event.target?.result as string,
          alt: file.name.replace(/\.[^/.]+$/, "") // Použitie názvu súboru ako alt
        };
        
        if (currentImage) {
          // Úprava existujúceho obrázka
          const updatedGallery = gallery.map(img => 
            img.id === currentImage.id ? {...img, src: newImage.src} : img
          );
          setGallery(updatedGallery);
          toast.success("Obrázok bol aktualizovaný");
        } else {
          // Pridanie nového obrázka
          setGallery([...gallery, newImage]);
          toast.success("Obrázok bol pridaný");
        }
        setIsImageDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const deleteImage = (id: number) => {
    if (confirm("Naozaj chcete odstrániť tento obrázok?")) {
      const updatedGallery = gallery.filter(img => img.id !== id);
      setGallery(updatedGallery);
      toast.success("Obrázok bol odstránený");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Spravovať fotogalériu</h2>
        <Button 
          onClick={() => openImageDialog()} 
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Pridať obrázok
        </Button>
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
            
            <div className="p-3 bg-white">
              <Input 
                value={image.alt}
                onChange={(e) => {
                  const updatedGallery = gallery.map(img => 
                    img.id === image.id ? {...img, alt: e.target.value} : img
                  );
                  setGallery(updatedGallery);
                }}
                placeholder="Popis obrázka"
                className="mt-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dialóg pre nahratie/úpravu obrázka */}
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
              <FormLabel>Vyberte obrázok</FormLabel>
              <Input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                Zrušiť
              </Button>
              <Button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
              >
                {currentImage ? "Nahrať nový obrázok" : "Nahrať"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface FormLabelProps {
  children: React.ReactNode;
}

const FormLabel: React.FC<FormLabelProps> = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);
