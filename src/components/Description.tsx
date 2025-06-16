import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Predvolený obsah apartmánu
export const apartmentDescription = {
  title: "Opis apartmánu",
  subtitle: "Komfortné ubytovanie pre vašu relaxačnú dovolenku",
  paragraph1: "Apartmán Tília sa nachádza v pokojnej časti obce Bešeňová, len niekoľko minút od známeho aquaparku. Náš moderný apartmán ponúka všetko, čo potrebujete pre dokonalý pobyt v tejto turisticky atraktívnej lokalite.",
  paragraph2: "Apartmán je vhodný pre páry aj rodiny s deťmi. Ponúka priestranný obývací priestor s plne vybavenou kuchyňou, samostatnú spálňu a moderné sociálne zariadenie. Z terasy si môžete vychutnávať krásny výhľad na okolitú prírodu.",
  features: [
    "Kompletne vybavená kuchyňa",
    "WiFi pripojenie",
    "Parkovanie priamo pri apartmáne",
    "Výhľad na hory",
    "15 minút pešo od aquaparku",
    "Klimatizácia",
    "Detská postieľka na vyžiadanie",
    "Terasa s posedením"
  ],
  images: []
};

const Description = () => {
  const [content, setContent] = useState(apartmentDescription);

  // Funkcia na načítanie obsahu z Supabase
  const loadContent = async () => {
    try {
      console.log('Description: Attempting to load content from Supabase');
      
      const { data, error } = await supabase
        .from('apartment_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('Description: Error loading content from Supabase:', error);
        setContent(apartmentDescription);
        return;
      }

      if (data) {
        console.log('Description: Successfully loaded content from Supabase:', data);
        // Konvertujeme Json typy na správne typy
        const convertedContent = {
          title: data.title,
          subtitle: data.subtitle,
          paragraph1: data.paragraph1,
          paragraph2: data.paragraph2,
          features: Array.isArray(data.features) ? data.features as string[] : apartmentDescription.features,
          images: Array.isArray(data.images) ? data.images as {src: string, alt: string}[] : apartmentDescription.images
        };
        setContent(convertedContent);
      } else {
        console.log('Description: No content found in Supabase, using defaults');
        setContent(apartmentDescription);
      }
    } catch (error) {
      console.error('Description: Error loading content:', error);
      setContent(apartmentDescription);
    }
  };

  // Load content from Supabase on component mount
  useEffect(() => {
    loadContent();

    // Listen for content updates from admin panel
    const handleContentUpdate = () => {
      console.log('Description: Received content update event');
      loadContent();
    };

    window.addEventListener('apartmentContentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('apartmentContentUpdated', handleContentUpdate);
    };
  }, []);

  return (
    <section id="opis" className="section-container bg-booking-gray/30">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8">
        <h2 className="section-title">{content.title}</h2>
        <p className="section-subtitle">{content.subtitle}</p>
        
        <div className="space-y-6">
          <p className="text-lg text-gray-700">
            {content.paragraph1}
          </p>
          
          <p className="text-lg text-gray-700">
            {content.paragraph2}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-booking-primary" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Description;
