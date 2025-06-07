
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { maritalStaysData } from "@/components/MaritalStays";
import { Save, Trash, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const MaritalStaysEditor = () => {
  const [content, setContent] = useState({...maritalStaysData});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");

  // Načítanie obsahu z Supabase pri načítaní komponenty
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      console.log('MaritalStaysEditor: Attempting to load content from Supabase');
      
      const { data, error } = await supabase
        .from('marital_stays_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('MaritalStaysEditor: Error loading content from Supabase:', error);
        setContent({...maritalStaysData});
        return;
      }

      if (data) {
        console.log('MaritalStaysEditor: Successfully loaded content from Supabase:', data);
        setContent(data);
      } else {
        console.log('MaritalStaysEditor: No content found in Supabase, using defaults');
        setContent({...maritalStaysData});
      }
    } catch (error) {
      console.error('MaritalStaysEditor: Error loading content:', error);
      setContent({...maritalStaysData});
    }
  };

  const saveMaritalStaysChanges = async () => {
    try {
      console.log('MaritalStaysEditor: Saving content to Supabase:', content);
      
      const { error } = await supabase
        .from('marital_stays_content')
        .upsert({
          id: 1,
          title: content.title,
          description: content.description,
          external_link: content.external_link,
          images: content.images,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('MaritalStaysEditor: Error saving content to Supabase:', error);
        toast.error("Chyba pri ukladaní obsahu do databázy");
        return;
      }

      console.log('MaritalStaysEditor: Successfully saved content to Supabase');
      
      // Odoslanie vlastnej udalosti na informovanie ostatných komponentov
      const event = new CustomEvent('maritalStaysContentUpdated');
      window.dispatchEvent(event);
      console.log('MaritalStaysEditor: Dispatched content update event');
      
      toast.success("Sekcia zážitkových pobytov bola úspešne uložená do databázy");
    } catch (error) {
      console.error('MaritalStaysEditor: Error saving content:', error);
      toast.error("Chyba pri ukladaní obsahu");
    }
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
      <h2 className="text-xl font-semibold mb-6">Upraviť sekciu zážitkových pobytov</h2>
      
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
            value={content.external_link}
            onChange={(e) => setContent({...content, external_link: e.target.value})}
            placeholder="https://www.manzelkepobyty.sk"
          />
        </div>
        
        <div>
          <Label>Obrázky pobytových balíčkov</Label>
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
                    <Label>Názov pobytového balíčka</Label>
                    <Input 
                      value={image.alt}
                      onChange={(e) => updateImage(image.id, 'alt', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Popis pobytového programu (cca 500 znakov)</Label>
                  <Textarea 
                    value={image.description}
                    onChange={(e) => updateImage(image.id, 'description', e.target.value)}
                    rows={6}
                    placeholder="Detailný popis zážitkového programu - približne 500 znakov..."
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
              <h4 className="font-medium mb-4">Pridať nový pobytový balíček</h4>
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
                    <Label>Názov pobytového balíčka</Label>
                    <Input 
                      placeholder="Názov balíčka..."
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Popis pobytového programu (cca 500 znakov)</Label>
                  <Textarea 
                    placeholder="Detailný popis zážitkového programu - približne 500 znakov..."
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
                Pridať pobytový balíček
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={saveMaritalStaysChanges}
          className="bg-booking-primary hover:bg-booking-secondary flex gap-2"
        >
          <Save size={16} />
          Uložiť zmeny zážitkových pobytov
        </Button>
      </div>
    </div>
  );
};
