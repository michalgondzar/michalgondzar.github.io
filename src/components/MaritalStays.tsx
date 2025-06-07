
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Predvolený obsah tematických pobytov s novou fotkou páru
export const maritalStaysData = {
  title: "Tematické pobyty",
  description: "Objavte naše špeciálne balíčky pobytov vytvorené pre páry a rodiny. Každý balíček obsahuje ubytovanie v našom apartmáne plus jedinečné zážitky v regióne Liptov.",
  external_link: "https://www.manzelkepobyty.sk",
  images: [
    {
      id: 1,
      src: "/lovable-uploads/073bfebd-c6ca-4da1-9efb-2a1080dff951.png",
      alt: "Manželský pobyt",
      description: "Romantický pobyt pre dvoch s wellness procedúrami, večerou pri sviečkach a privátnym využitím vírivky. Balíček obsahuje 2 noci v apartmáne, raňajky, romantickú večeru, masáže pre dvoch a vstupy do aquaparku. Ideálny pre mladomanželov alebo páry oslavujúce výročie."
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Rodinný pobyt",
      description: "Akčný rodinný pobyt plný dobrodružstv pre celú rodinu. Obsahuje 3 noci v apartmáne, raňajky, vstupy do aquaparku, rafting na Váhu, návštevu Bojnického zámku a interaktívne workshopy pre deti. Program je prispôsobený rodinám s deťmi od 6 rokov."
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Pobyt v komôrke",
      description: "Jedinečný pobyt v štýlovej komôrke pre tých, ktorí hľadajú niečo výnimočné. Obsahuje 1 noc v autenticky zariadenom priestore, raňajky, degustáciu miestnych špecialít a sprievodcu po historických miestach. Ideálne pre páry hľadajúce nekonvenčný zážitok."
    }
  ]
};

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

const MaritalStays = () => {
  const [content, setContent] = useState<MaritalStayContent>(maritalStaysData);
  const [isLoading, setIsLoading] = useState(true);

  // Funkcia na načítanie obsahu z Supabase
  const loadContent = async () => {
    try {
      console.log('MaritalStays: Attempting to load content from Supabase');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('marital_stays_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('MaritalStays: Error loading content from Supabase:', error);
        console.log('MaritalStays: Using default content due to error');
        setContent(maritalStaysData);
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('MaritalStays: Successfully loaded content from Supabase:', data);
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
        console.log('MaritalStays: No content found in Supabase, using defaults');
        setContent(maritalStaysData);
      }
    } catch (error) {
      console.error('MaritalStays: Error loading content:', error);
      setContent(maritalStaysData);
    } finally {
      setIsLoading(false);
    }
  };

  // Load content from Supabase on component mount
  useEffect(() => {
    loadContent();

    // Listen for content updates from admin panel
    const handleContentUpdate = () => {
      console.log('MaritalStays: Received content update event');
      loadContent();
    };

    window.addEventListener('maritalStaysContentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('maritalStaysContentUpdated', handleContentUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <section id="pobyty" className="section-container bg-gradient-to-br from-booking-primary/5 to-booking-secondary/10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center">
            <p>Načítavam tematické pobyty...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pobyty" className="section-container bg-gradient-to-br from-booking-primary/5 to-booking-secondary/10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{content.title}</h2>
          <p className="section-subtitle max-w-4xl mx-auto">
            {content.description}
          </p>
          <a 
            href={content.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-booking-primary text-white rounded-lg hover:bg-booking-secondary transition-colors"
          >
            Pozrieť všetky balíčky
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.images.map((image) => (
            <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                    {image.alt}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    {image.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaritalStays;
