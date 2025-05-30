
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ImportGalleryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportGallery: (file: File) => Promise<boolean>;
}

export const ImportGalleryDialog = ({ isOpen, onClose, onImportGallery }: ImportGalleryDialogProps) => {
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const handleImportGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await onImportGallery(file);
    if (success) {
      onClose();
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onClose}
          >
            Zrušiť
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
