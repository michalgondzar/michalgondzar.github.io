
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface MaritalStayImage {
  id: number;
  src: string;
  alt: string;
  description: string;
}

interface MaritalStayAddFormProps {
  onAdd: (image: Omit<MaritalStayImage, 'id'>) => void;
  maxId: number;
}

export const MaritalStayAddForm = ({ onAdd, maxId }: MaritalStayAddFormProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");

  const handleAdd = () => {
    if (newImageUrl.trim() && newImageAlt.trim() && newImageDescription.trim()) {
      onAdd({
        src: newImageUrl.trim(),
        alt: newImageAlt.trim(),
        description: newImageDescription.trim()
      });
      setNewImageUrl("");
      setNewImageAlt("");
      setNewImageDescription("");
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <h4 className="font-medium mb-4">Pridať nový tematický pobyt</h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>URL obrázku</Label>
            <Input 
              placeholder="https://example.com/image.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Názov tematického pobytu</Label>
            <Input 
              placeholder="Názov pobytu..."
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Popis tematického programu (cca 500 znakov)</Label>
          <Textarea 
            placeholder="Detailný popis tematického programu - približne 500 znakov..."
            value={newImageDescription}
            onChange={(e) => setNewImageDescription(e.target.value)}
            rows={6}
          />
          <div className="text-xs text-gray-500 mt-1">
            Znakov: {newImageDescription.length}
          </div>
        </div>
      </div>
      <Button 
        onClick={handleAdd}
        className="mt-4"
        disabled={!newImageUrl.trim() || !newImageAlt.trim() || !newImageDescription.trim()}
      >
        <Plus size={16} className="mr-2" />
        Pridať tematický pobyt
      </Button>
    </div>
  );
};
