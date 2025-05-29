
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { maritalStaysData } from "@/components/MaritalStays";
import { Save, Trash, Plus } from "lucide-react";

export const MaritalStaysEditor = () => {
  const [content, setContent] = useState({...maritalStaysData});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");

  const saveMaritalStaysChanges = () => {
    // V reálnej aplikácii by tu bol API volanie na uloženie do databázy
    toast.success("Sekcia manželských pobytov bola úspešne uložená");
  };
  
  const addImage = () => {
    if (newImageUrl.trim() !== "" && newImageAlt.trim() !== "" && newImageDescription.trim() !== "") {
      const newImage = {
        id: Math.max(...content.images.map(img => img.id)) + 1,
        src: newImageUrl.trim(),
        alt: newImageAlt.trim(),
        description: newImageDescription.trim()
      };
      setContent({
        ...content,
        images: [...content.images, newImage]
      });
      setNewImageUrl("");
      setNewImageAlt("");
      setNewImageDescription("");
      toast.success("Obrázok bol pridaný");
    }
  };
  
  const removeImage = (imageId: number) => {
    const updatedImages = content.images.filter(img => img.id !== imageId);
    setContent({...content, images: updatedImages});
    toast.success("Obrázok bol odstránený");
  };

  const updateImage = (imageId: number, field: 'src' | 'alt' | 'description', value: string) => {
    const updatedImages = content.images.map(img => 
      img.id === imageId ? {...img, [field]: value} : img
    );
    setContent({...content, images: updatedImages});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upraviť sekciu manželských pobytov</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Nadpis sekcie</Label>
          <Input 
            id="title"
            value={content.title} 
            onChange={(e) => setContent({...content, title: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="description">Popis</Label>
          <Textarea 
            id="description"
            rows={4}
            value={content.description}
            onChange={(e) => setContent({...content, description: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="externalLink">Externý odkaz</Label>
          <Input 
            id="externalLink"
            value={content.externalLink}
            onChange={(e) => setContent({...content, externalLink: e.target.value})}
            placeholder="https://www.manzelkepobyty.sk"
          />
        </div>
        
        <div>
          <Label>Obrázky</Label>
          <div className="space-y-4 mt-2">
            {content.images.map((image) => (
              <div key={image.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>URL obrázku</Label>
                    <Input 
                      value={image.src}
                      onChange={(e) => updateImage(image.id, 'src', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Názov obrázku</Label>
                    <Input 
                      value={image.alt}
                      onChange={(e) => updateImage(image.id, 'alt', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Popis obrázku (cca 500 znakov)</Label>
                  <Textarea 
                    value={image.description}
                    onChange={(e) => updateImage(image.id, 'description', e.target.value)}
                    rows={6}
                    placeholder="Detailný popis obrázku - približne 500 znakov..."
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
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-4">Pridať nový obrázok</h4>
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
                    <Label>Názov obrázku</Label>
                    <Input 
                      placeholder="Názov obrázku..."
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Popis obrázku (cca 500 znakov)</Label>
                  <Textarea 
                    placeholder="Detailný popis obrázku - približne 500 znakov..."
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
                onClick={addImage}
                className="mt-4"
                disabled={!newImageUrl.trim() || !newImageAlt.trim() || !newImageDescription.trim()}
              >
                <Plus size={16} className="mr-2" />
                Pridať obrázok
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={saveMaritalStaysChanges}
          className="bg-booking-primary hover:bg-booking-secondary flex gap-2"
        >
          <Save size={16} />
          Uložiť zmeny manželských pobytov
        </Button>
      </div>
    </div>
  );
};
