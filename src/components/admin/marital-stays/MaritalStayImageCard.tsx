
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";

interface MaritalStayImage {
  id: number;
  src: string;
  alt: string;
  description: string;
}

interface MaritalStayImageCardProps {
  image: MaritalStayImage;
  onUpdate: (imageId: number, field: 'src' | 'alt' | 'description', value: string) => void;
  onRemove: (imageId: number) => void;
}

export const MaritalStayImageCard = ({ image, onUpdate, onRemove }: MaritalStayImageCardProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>URL obrázku</Label>
          <Input 
            value={image.src}
            onChange={(e) => onUpdate(image.id, 'src', e.target.value)}
          />
        </div>
        <div>
          <Label>Názov tematického pobytu</Label>
          <Input 
            value={image.alt}
            onChange={(e) => onUpdate(image.id, 'alt', e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <Label>Popis tematického programu (cca 500 znakov)</Label>
        <Textarea 
          value={image.description}
          onChange={(e) => onUpdate(image.id, 'description', e.target.value)}
          rows={6}
          placeholder="Detailný popis tematického programu - približne 500 znakov..."
        />
        <div className="text-xs text-gray-500 mt-1">
          Znakov: {image.description?.length || 0}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <img 
          src={image.src} 
          alt={image.alt}
          className="w-20 h-20 object-cover rounded"
        />
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onRemove(image.id)}
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};
