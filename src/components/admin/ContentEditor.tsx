
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apartmentDescription } from "@/components/Description";
import { Save, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BilingualContent {
  title: { sk: string; pl: string };
  subtitle: { sk: string; pl: string };
  paragraph1: { sk: string; pl: string };
  paragraph2: { sk: string; pl: string };
  features: { sk: string[]; pl: string[] };
  images: {src: string, alt: string}[];
}

export const ContentEditor = () => {
  const [content, setContent] = useState<BilingualContent>({
    title: { sk: apartmentDescription.title, pl: apartmentDescription.title },
    subtitle: { sk: apartmentDescription.subtitle, pl: apartmentDescription.subtitle },
    paragraph1: { sk: apartmentDescription.paragraph1, pl: apartmentDescription.paragraph1 },
    paragraph2: { sk: apartmentDescription.paragraph2, pl: apartmentDescription.paragraph2 },
    features: { sk: [...apartmentDescription.features], pl: [...apartmentDescription.features] },
    images: [...apartmentDescription.images]
  });
  
  const [newFeature, setNewFeature] = useState({ sk: "", pl: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Load content from Supabase on component mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      console.log('ContentEditor: Attempting to load content from Supabase');
      
      const { data, error } = await supabase
        .from('apartment_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('ContentEditor: Error loading content from Supabase:', error);
        return;
      }

      if (data) {
        console.log('ContentEditor: Successfully loaded content from Supabase:', data);
        
        // Ak sú údaje v novom formáte (dvojjazyčné), použiť ich
        if (data.title_sk || data.title_pl) {
          const convertedContent: BilingualContent = {
            title: { 
              sk: data.title_sk || data.title || apartmentDescription.title, 
              pl: data.title_pl || data.title || apartmentDescription.title 
            },
            subtitle: { 
              sk: data.subtitle_sk || data.subtitle || apartmentDescription.subtitle, 
              pl: data.subtitle_pl || data.subtitle || apartmentDescription.subtitle 
            },
            paragraph1: { 
              sk: data.paragraph1_sk || data.paragraph1 || apartmentDescription.paragraph1, 
              pl: data.paragraph1_pl || data.paragraph1 || apartmentDescription.paragraph1 
            },
            paragraph2: { 
              sk: data.paragraph2_sk || data.paragraph2 || apartmentDescription.paragraph2, 
              pl: data.paragraph2_pl || data.paragraph2 || apartmentDescription.paragraph2 
            },
            features: { 
              sk: data.features_sk ? (Array.isArray(data.features_sk) ? data.features_sk as string[] : apartmentDescription.features) : (Array.isArray(data.features) ? data.features as string[] : apartmentDescription.features),
              pl: data.features_pl ? (Array.isArray(data.features_pl) ? data.features_pl as string[] : apartmentDescription.features) : (Array.isArray(data.features) ? data.features as string[] : apartmentDescription.features)
            },
            images: Array.isArray(data.images) ? data.images as {src: string, alt: string}[] : apartmentDescription.images
          };
          setContent(convertedContent);
        } else {
          // Starý formát, konvertovať na dvojjazyčný
          const convertedContent: BilingualContent = {
            title: { sk: data.title, pl: data.title },
            subtitle: { sk: data.subtitle, pl: data.subtitle },
            paragraph1: { sk: data.paragraph1, pl: data.paragraph1 },
            paragraph2: { sk: data.paragraph2, pl: data.paragraph2 },
            features: { 
              sk: Array.isArray(data.features) ? data.features as string[] : apartmentDescription.features,
              pl: Array.isArray(data.features) ? data.features as string[] : apartmentDescription.features
            },
            images: Array.isArray(data.images) ? data.images as {src: string, alt: string}[] : apartmentDescription.images
          };
          setContent(convertedContent);
        }
      }
    } catch (error) {
      console.error('ContentEditor: Error loading content:', error);
    }
  };

  const saveContentChanges = async () => {
    setIsLoading(true);
    try {
      console.log('ContentEditor: Saving bilingual content to Supabase:', content);
      
      const { error } = await supabase
        .from('apartment_content')
        .upsert({
          id: 1,
          // Zachovať spätná kompatibilita so starým formátom
          title: content.title.sk,
          subtitle: content.subtitle.sk,
          paragraph1: content.paragraph1.sk,
          paragraph2: content.paragraph2.sk,
          features: content.features.sk,
          // Nové dvojjazyčné polia
          title_sk: content.title.sk,
          title_pl: content.title.pl,
          subtitle_sk: content.subtitle.sk,
          subtitle_pl: content.subtitle.pl,
          paragraph1_sk: content.paragraph1.sk,
          paragraph1_pl: content.paragraph1.pl,
          paragraph2_sk: content.paragraph2.sk,
          paragraph2_pl: content.paragraph2.pl,
          features_sk: content.features.sk,
          features_pl: content.features.pl,
          images: content.images,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('ContentEditor: Error saving content to Supabase:', error);
        toast.error("Chyba pri ukladaní obsahu do databázy");
        return;
      }

      console.log('ContentEditor: Successfully saved bilingual content to Supabase');
      
      // Refresh the page content by triggering a reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      toast.success("Dvojjazyčné zmeny obsahu boli úspešne uložené a stránka sa obnoví");
    } catch (error) {
      console.error('ContentEditor: Error saving content:', error);
      toast.error("Chyba pri ukladaní obsahu");
    } finally {
      setIsLoading(false);
    }
  };
  
  const addFeature = (lang: 'sk' | 'pl') => {
    if (newFeature[lang].trim() !== "") {
      setContent({
        ...content,
        features: {
          ...content.features,
          [lang]: [...content.features[lang], newFeature[lang].trim()]
        }
      });
      setNewFeature({...newFeature, [lang]: ""});
      toast.success(`Funkcia bola pridaná (${lang.toUpperCase()})`);
    }
  };
  
  const removeFeature = (index: number, lang: 'sk' | 'pl') => {
    const updatedFeatures = [...content.features[lang]];
    updatedFeatures.splice(index, 1);
    setContent({
      ...content, 
      features: {
        ...content.features,
        [lang]: updatedFeatures
      }
    });
    toast.success(`Funkcia bola odstránená (${lang.toUpperCase()})`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upraviť obsah stránky (dvojjazyčne)</h2>
      
      <Tabs defaultValue="sk" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sk">🇸🇰 Slovenčina</TabsTrigger>
          <TabsTrigger value="pl">🇵🇱 Polština</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sk" className="space-y-4 mt-6">
          <div>
            <FormLabel>Nadpis sekcie (SK)</FormLabel>
            <Input 
              value={content.title.sk} 
              onChange={(e) => setContent({
                ...content, 
                title: { ...content.title, sk: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Podnadpis (SK)</FormLabel>
            <Input 
              value={content.subtitle.sk}
              onChange={(e) => setContent({
                ...content, 
                subtitle: { ...content.subtitle, sk: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Prvý odstavec (SK)</FormLabel>
            <Textarea 
              rows={4}
              value={content.paragraph1.sk}
              onChange={(e) => setContent({
                ...content, 
                paragraph1: { ...content.paragraph1, sk: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Druhý odstavec (SK)</FormLabel>
            <Textarea 
              rows={4}
              value={content.paragraph2.sk}
              onChange={(e) => setContent({
                ...content, 
                paragraph2: { ...content.paragraph2, sk: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Funkcie apartmánu (SK)</FormLabel>
            <div className="space-y-2">
              {content.features.sk.map((feat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feat} readOnly />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFeature(index, 'sk')}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-4">
                <Input 
                  placeholder="Zadajte novú funkciu apartmánu (SK)..."
                  value={newFeature.sk}
                  onChange={(e) => setNewFeature({...newFeature, sk: e.target.value})}
                />
                <Button onClick={() => addFeature('sk')}>Pridať</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pl" className="space-y-4 mt-6">
          <div>
            <FormLabel>Nadpis sekcie (PL)</FormLabel>
            <Input 
              value={content.title.pl} 
              onChange={(e) => setContent({
                ...content, 
                title: { ...content.title, pl: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Podnadpis (PL)</FormLabel>
            <Input 
              value={content.subtitle.pl}
              onChange={(e) => setContent({
                ...content, 
                subtitle: { ...content.subtitle, pl: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Prvý odstavec (PL)</FormLabel>
            <Textarea 
              rows={4}
              value={content.paragraph1.pl}
              onChange={(e) => setContent({
                ...content, 
                paragraph1: { ...content.paragraph1, pl: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Druhý odstavec (PL)</FormLabel>
            <Textarea 
              rows={4}
              value={content.paragraph2.pl}
              onChange={(e) => setContent({
                ...content, 
                paragraph2: { ...content.paragraph2, pl: e.target.value }
              })}
            />
          </div>
          
          <div>
            <FormLabel>Funkcie apartmánu (PL)</FormLabel>
            <div className="space-y-2">
              {content.features.pl.map((feat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feat} readOnly />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFeature(index, 'pl')}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-4">
                <Input 
                  placeholder="Wprowadź nową funkcję apartamentu (PL)..."
                  value={newFeature.pl}
                  onChange={(e) => setNewFeature({...newFeature, pl: e.target.value})}
                />
                <Button onClick={() => addFeature('pl')}>Dodaj</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={saveContentChanges}
        disabled={isLoading}
        className="mt-6 bg-booking-primary hover:bg-booking-secondary flex gap-2"
      >
        <Save size={16} />
        {isLoading ? "Ukladám..." : "Uložiť dvojjazyčné zmeny obsahu"}
      </Button>
    </div>
  );
};
