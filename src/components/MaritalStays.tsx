
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Predvolený obsah zážitkových pobytov
export const maritalStaysData = {
  title: "Zážitkové pobyty",
  description: "Objavte naše špeciálne balíčky pobytov vytvorené pre páry a rodiny. Každý balíček obsahuje ubytovanie v našom apartmáne plus jedinečné zážitky v regióne Liptov.",
  external_link: "https://www.manzelkepobyty.sk",
  images: [
    {
      id: 1,
      src: "/lovable-uploads/2c593486-67fc-4e6f-9a4c-827cde9f1af7.png",
      alt: "Romantický pobyt",
      description: "Romantický pobyt pre dvoch s wellness procedúrami, večerou pri sviečkach a privátnym využitím vírivky. Balíček obsahuje 2 noci v apartmáne, raňajky, romantickú večeru, masáže pre dvoch a vstupy do aquaparku. Ideálny pre mladomanželov alebo páry oslavujúce výročie."
    },
    {
      id: 2,
      src: "/lovable-uploads/e0d6e731-19cb-4f27-b266-77fa22211eb6.png",
      alt: "Rodinný dobrodružný pobyt",
      description: "Akčný rodinný pobyt plný dobrodružstv pre celú rodinu. Obsahuje 3 noci v apartmáne, raňajky, vstupy do aquaparku, rafting na Váhu, návštevu Bojnického zámku a interaktívne workshopy pre deti. Program je prispôsobený rodinám s deťmi od 6 rokov."
    }
  ]
};

const MaritalStays = () => {
  const [content, setContent] = useState(maritalStaysData);

  // Funkcia na načítanie obsahu z Supabase
  const loadContent = async () => {
    try {
      console.log('MaritalStays: Attempting to load content from Supabase');
      
      const { data, error } = await supabase
        .from('marital_stays_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('MaritalStays: Error loading content from Supabase:', error);
        setContent(maritalStaysData);
        return;
      }

      if (data) {
        console.log('MaritalStays: Successfully loaded content from Supabase:', data);
        // Konvertujeme Json typ na správny typ
        const convertedContent = {
          title: data.title,
          description: data.description,
          external_link: data.external_link,
          images: Array.isArray(data.images) ? 
            data.images as {id: number, src: string, alt: string, description: string}[] : 
            maritalStaysData.images
        };
        setContent(convertedContent);
      } else {
        console.log('MaritalStays: No content found in Supabase, using defaults');
        setContent(maritalStaysData);
      }
    } catch (error) {
      console.error('MaritalStays: Error loading content:', error);
      setContent(maritalStaysData);
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

        <div className="grid md:grid-cols-2 gap-8">
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
