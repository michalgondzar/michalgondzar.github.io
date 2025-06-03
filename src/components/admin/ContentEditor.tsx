
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { apartmentDescription } from "@/components/Description";
import { Save, Trash } from "lucide-react";

export const ContentEditor = () => {
  const [content, setContent] = useState({...apartmentDescription});
  const [feature, setFeature] = useState("");

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('apartmentContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setContent(parsedContent);
        console.log('Loaded content from localStorage:', parsedContent);
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
  }, []);

  const saveContentChanges = () => {
    // Save to localStorage
    localStorage.setItem('apartmentContent', JSON.stringify(content));
    console.log('Saving content to localStorage:', content);
    toast.success("Zmeny obsahu boli úspešne uložené");
  };
  
  const addFeature = () => {
    if (feature.trim() !== "") {
      setContent({
        ...content,
        features: [...content.features, feature.trim()]
      });
      setFeature("");
      toast.success("Funkcia bola pridaná");
    }
  };
  
  const removeFeature = (index: number) => {
    const updatedFeatures = [...content.features];
    updatedFeatures.splice(index, 1);
    setContent({...content, features: updatedFeatures});
    toast.success("Funkcia bola odstránená");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upraviť obsah stránky</h2>
      
      <div className="space-y-4">
        <div>
          <FormLabel>Nadpis sekcie</FormLabel>
          <Input 
            value={content.title} 
            onChange={(e) => setContent({...content, title: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Podnadpis</FormLabel>
          <Input 
            value={content.subtitle}
            onChange={(e) => setContent({...content, subtitle: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Prvý odstavec</FormLabel>
          <Textarea 
            rows={4}
            value={content.paragraph1}
            onChange={(e) => setContent({...content, paragraph1: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Druhý odstavec</FormLabel>
          <Textarea 
            rows={4}
            value={content.paragraph2}
            onChange={(e) => setContent({...content, paragraph2: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Funkcie apartmánu</FormLabel>
          <div className="space-y-2">
            {content.features.map((feat, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={feat} readOnly />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center gap-2 mt-4">
              <Input 
                placeholder="Zadajte novú funkciu apartmánu..."
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
              />
              <Button onClick={addFeature}>Pridať</Button>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={saveContentChanges}
          className="mt-6 bg-booking-primary hover:bg-booking-secondary flex gap-2"
        >
          <Save size={16} />
          Uložiť zmeny obsahu
        </Button>
      </div>
    </div>
  );
};
