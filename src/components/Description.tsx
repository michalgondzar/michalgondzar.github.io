
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Predvolený obsah apartmánu s novými obrázkami
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
  images: [
    {
      src: "/lovable-uploads/3f225527-0827-4edd-870a-1d7428d75fc0.png",
      alt: "Interiér apartmánu s obývacou časťou a spálňou"
    },
    {
      src: "/lovable-uploads/9b16e763-1abc-46dc-a3be-31a6d48e680a.png",
      alt: "Termálne kúpaliště v Bešeňovej - vnútorné bazény"
    },
    {
      src: "/lovable-uploads/926541a0-eee0-4ba3-975d-9de05f634875.png",
      alt: "Aquapark Bešeňová s vonkajšími bazénmi a tobogánmi"
    }
  ]
};

const Description = () => {
  const [content, setContent] = useState(apartmentDescription);

  // Funkcia na načítanie obsahu z Supabase
  const loadContent = async () => {
    try {
      console.log('Description: Loading content from Supabase');
      
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

  // Load content from Supabase on component mount and set up periodic refresh
  useEffect(() => {
    loadContent();
    
    // Refresh content every 30 seconds to catch updates
    const interval = setInterval(loadContent, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="opis" className="section-container bg-booking-gray/30">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8">
        <h2 className="section-title">{content.title}</h2>
        <p className="section-subtitle">{content.subtitle}</p>
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
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
          
          {content.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="col-span-2">
                <CardContent className="p-0">
                  <img 
                    src={content.images[0].src}
                    alt={content.images[0].alt}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
              {content.images[1] && (
                <Card>
                  <CardContent className="p-0">
                    <img 
                      src={content.images[1].src}
                      alt={content.images[1].alt}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}
              {content.images[2] && (
                <Card>
                  <CardContent className="p-0">
                    <img 
                      src={content.images[2].src}
                      alt={content.images[2].alt}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Description;
