import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { maritalStaysData } from "@/components/MaritalStays";
import { Save, Trash, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MaritalStayImage {
  id: number;
  src: string;
  alt: string;
  description: string;
}

interface MaritalStayContent {
  title: string;
  description: string;
  external_link: string;
  images: MaritalStayImage[];
}

export const MaritalStaysEditor = () => {
  const [content, setContent] = useState<MaritalStayContent>({...maritalStaysData});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Načítanie obsahu z Supabase pri načítaní komponenty
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      console.log('MaritalStaysEditor: Attempting to load content from Supabase');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('marital_stays_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('MaritalStaysEditor: Error loading content from Supabase:', error);
        console.log('MaritalStaysEditor: Using default content due to error');
        setContent({...maritalStaysData});
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('MaritalStaysEditor: Successfully loaded content from Supabase:', data);
        // Safe type casting for images from Json to our interface
        const images = Array.isArray(data.images) 
          ? (data.images as unknown as MaritalStayImage[])
          : maritalStaysData.images;
        
        const convertedContent: MaritalStayContent = {
          title: data.title || maritalStaysData.title,
          description: data.description || maritalStaysData.description,
          external_link: data.external_link || maritalStaysData.external_link,
          images: images.length >= 3 ? images : maritalStaysData.images
        };
        setContent(convertedContent);
      } else {
        console.log('MaritalStaysEditor: No content found in Supabase, initializing with defaults');
        setContent({...maritalStaysData});
        // Automaticky uložíme predvolený obsah do databázy
        await saveDefaultContent();
      }
    } catch (error) {
      console.error('MaritalStaysEditor: Error loading content:', error);
      setContent({...maritalStaysData});
    } finally {
      setIsLoading(false);
    }
  };

  const saveDefaultContent = async () => {
    try {
      console.log('MaritalStaysEditor: Saving default content to Supabase');
      
      const { error } = await supabase
        .from('marital_stays_content')
        .upsert({
          id: 1,
          title: maritalStaysData.title,
          description: maritalStaysData.description,
          external_link: maritalStaysData.external_link,
          images: maritalStaysData.images as any,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('MaritalStaysEditor: Error saving default content:', error);
      } else {
        console.log('MaritalStaysEditor: Default content saved successfully');
      }
    } catch (error) {
      console.error('MaritalStaysEditor: Error in saveDefaultContent:', error);
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
          images: content.images as any,
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
      
      toast.success("Sekcia tematických pobytov bola úspešne uložená do databázy");
    } catch (error) {
      console.error('MaritalStaysEditor: Error saving content:', error);
      toast.error("Chyba pri ukladaní obsahu");
    }
  };
  
  const addImage = () => {
    if (newImageUrl.trim() !== "" && newImageAlt.trim() !== "" && newImageDescription.trim() !== "") {
      const newImage: MaritalStayImage = {
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
      toast.success("Tematický pobyt bol pridaný");
    }
  };
  
  const removeImage = (imageId: number) => {
    const updatedImages = content.images.filter(img => img.id !== imageId);
    setContent({...content, images: updatedImages});
    toast.success("Tematický pobyt bol odstránený");
  };

  const updateImage = (imageId: number, field: 'src' | 'alt' | 'description', value: string) => {
    const updatedImages = content.images.map(img => 
      img.id === imageId ? {...img, [field]: value} : img
    );
    setContent({...content, images: updatedImages});
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Načítavam editor tematických pobytov...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upraviť sekciu tematických pobytov</h2>
      
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
          <Label>Tematické pobyty</Label>
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
                    <Label>Názov tematického pobytu</Label>
                    <Input 
                      value={image.alt}
                      onChange={(e) => updateImage(image.id, 'alt', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Popis tematického programu (cca 500 znakov)</Label>
                  <Textarea 
                    value={image.description}
                    onChange={(e) => updateImage(image.id, 'description', e.target.value)}
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
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
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
                onClick={addImage}
                className="mt-4"
                disabled={!newImageUrl.trim() || !newImageAlt.trim() || !newImageDescription.trim()}
              >
                <Plus size={16} className="mr-2" />
                Pridať tematický pobyt
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={saveMaritalStaysChanges}
          className="bg-booking-primary hover:bg-booking-secondary flex gap-2"
        >
          <Save size={16} />
          Uložiť zmeny tematických pobytov
        </Button>
      </div>
    </div>
  );
};
