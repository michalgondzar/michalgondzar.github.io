import { useState, useEffect } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Predvolené údaje pre sekciu tématických pobytov
export const maritalStaysData = {
  title: "Tématické pobyty",
  description: "Vyberte si z našich pripravených zážitkových programov, ktoré vám sprístupnia jedinečné chvíle v krásnom prostredí Bešeňovej. Každý balíček obsahuje starostlivo pripravené aktivity pre nezabudnuteľné zážitky.",
  images: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
      alt: "Manželský pobyt",
      description: "Romantický balíček pre manželské páry zahŕňa intímne zážitky, candlelight dinner, relaxačné procedúry a spoločné aktivity zamerané na posilnenie vzájomnej blízkosti. Program obsahuje prechádzky prírodou, degustácie miestnych špecialít a večerné chvíle pri sviečkach. Vytvorte si nezabudnuteľné spomienky v útulnom prostredí nášho apartmánu s výhľadom na krásnu prírodu Bešeňovej."
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      alt: "Rodinný pobyt",
      description: "Rodinný zážitkový program je navrhnutý pre rodiny s deťmi a obsahuje aktivity vhodné pre všetky vekové kategórie. Zahŕňa výlety do okolia, návštevu aquaparku, spoločné hry a tvorivé workshopy. Pripravené sú aj piknikové balíčky, poznávacie túry po okolí a zábavné aktivity, ktoré zbližujú rodinných príslušníkov a vytvárajú krásne spoločné spomienky."
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      alt: "Pobyt v komôrke",
      description: "Exkluzívny program pre tých, ktorí hľadajú úplné súkromie a oddych od civilizácie. Pobyt v komôrke obsahuje digitálny detox, meditačné chvíle, čítanie kníh a aktivity zamerané na vnútorný pokoj. Program zahŕňa aj zdravé stravovanie, jemné relaxačné cvičenia a možnosť úplného odpojenia od vonkajšieho sveta v tichom a pokojnom prostredí apartmánu."
    }
  ],
  externalLink: "https://www.manzelkepobyty.sk"
};

const MaritalStays = () => {
  const [content, setContent] = useState(maritalStaysData);

  // Načítanie obsahu z localStorage pri načítaní komponenty
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('maritalStaysContent');
      console.log('MaritalStays: Attempting to load content from localStorage');
      
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        console.log('MaritalStays: Successfully loaded content:', parsedContent);
        setContent(parsedContent);
      } else {
        console.log('MaritalStays: No saved content found, using defaults');
        setContent(maritalStaysData);
      }
    } catch (error) {
      console.error('MaritalStays: Error parsing saved content:', error);
      setContent(maritalStaysData);
    }
  }, []);

  // Poslúchanie na zmeny obsahu z admin panelu
  useEffect(() => {
    const handleContentUpdate = () => {
      try {
        const savedContent = localStorage.getItem('maritalStaysContent');
        if (savedContent) {
          const parsedContent = JSON.parse(savedContent);
          console.log('MaritalStays: Content updated from admin panel:', parsedContent);
          setContent(parsedContent);
        }
      } catch (error) {
        console.error('MaritalStays: Error loading updated content:', error);
      }
    };

    window.addEventListener('maritalStaysContentUpdated', handleContentUpdate);
    return () => {
      window.removeEventListener('maritalStaysContentUpdated', handleContentUpdate);
    };
  }, []);

  return (
    <section id="tematicke-pobyty" className="bg-white py-16">
      <div className="section-container">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500" />
            <h2 className="section-title mb-0">{content.title}</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {content.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {content.images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">{image.alt}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              asChild
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg"
            >
              <a 
                href={content.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Navštíviť www.manzelskepobyty.sk
                <ExternalLink size={18} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaritalStays;
