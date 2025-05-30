
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GalleryImage } from "@/utils/supabaseGallery";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: GalleryImage | null;
  onImageUpload: (file: File) => Promise<boolean>;
  isLoading: boolean;
}

export const ImageUploadDialog = ({ 
  isOpen, 
  onClose, 
  currentImage, 
  onImageUpload, 
  isLoading 
}: ImageUploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await onImageUpload(file);
    if (success) {
      onClose();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onClose}
            disabled={isLoading}
          >
            Zrušiť
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
