
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";
import { GalleryImage } from "@/utils/supabaseGallery";

interface GalleryGridProps {
  gallery: GalleryImage[];
  onEditImage: (image: GalleryImage) => void;
  onDeleteImage: (id: number) => void;
  onUpdateImageAlt: (id: number, alt: string) => void;
  onUpdateImageCategory: (id: number, category: string) => void;
  onUpdateImageName: (id: number, name: string) => void;
}

export const GalleryGrid = ({ 
  gallery, 
  onEditImage, 
  onDeleteImage, 
  onUpdateImageAlt, 
  onUpdateImageCategory,
  onUpdateImageName
}: GalleryGridProps) => {
  return (
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
                onClick={() => onEditImage(image)}
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDeleteImage(image.id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
          
          <div className="p-3 bg-white space-y-2">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Názov súboru</label>
              <Input 
                value={image.name || image.alt}
                onChange={(e) => onUpdateImageName(image.id, e.target.value)}
                placeholder="Názov súboru"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Popis obrázka</label>
              <Input 
                value={image.alt}
                onChange={(e) => onUpdateImageAlt(image.id, e.target.value)}
                placeholder="Popis obrázka"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Kategória</label>
              <select 
                value={image.category}
                onChange={(e) => onUpdateImageCategory(image.id, e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="interior">Interiér</option>
                <option value="exterior">Exteriér</option>
                <option value="surroundings">Okolie</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
