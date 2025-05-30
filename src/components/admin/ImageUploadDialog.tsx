
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GalleryImage } from "@/utils/supabaseGallery";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: GalleryImage | null;
  onImageUpload: (file: File, description?: string) => Promise<boolean>;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill description with filename without extension
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDescription(nameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await onImageUpload(selectedFile, description);
    if (success) {
      onClose();
      setSelectedFile(null);
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedFile(null);
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              onChange={handleFileSelect}
              disabled={isLoading}
            />
          </div>
          
          {selectedFile && (
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Popis obrázka
              </label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Zadajte popis obrázka..."
                disabled={isLoading}
                rows={3}
              />
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Zrušiť
          </Button>
          {selectedFile && (
            <Button 
              type="button" 
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "Nahráva sa..." : "Nahrať"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
