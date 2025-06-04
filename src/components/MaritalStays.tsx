
import { useState, useEffect } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Predvolené údaje pre sekciu tématických pobytov
export const maritalStaysData = {
  title: "Tématické pobyty",
  description: "Doprajte si romantický pobyt v útulnom prostredí nášho apartmánu. Vytvorte si nezabudnuteľné chvíle s vašou láskou v krásnom prostredí Bešeňovej.",
  images: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      alt: "Romantická obývacia izba",
      description: "Útulná a štýlovo zariadená obývacia izba s pohodlným sedením je ideálnym miestom pre romantické večery. Jemné osvetlenie a teplé farby vytvárajú atmosféru intimity a pokoja. Tu si môžete vychutnať spoločné chvíle pri víne, sledovaní filmu alebo len tak pri rozhovoroch o vašich snoch a plánoch. Priestor je navrhnutý tak, aby podporoval blízkosť a vytváranie krásnych spomienok na váš manželský pobyt."
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      alt: "Krásne okolie pre romantické prechádzky",
      description: "Nádherná príroda okolo apartmánu ponúka nekonečné možnosti pre romantické prechádzky a výlety. Zelené lesy, čisté horské vzduch a pokojná atmosféra vytvárajú perfektné prostredie pre páry, ktoré chcú uniknúť z každodenného zhonu. Môžete objaviť skryté chodníčky, piknikovať v prírode alebo si len tak užívať ticho a krásu slovenskej krajiny. Každý krok v tomto prostredí prináša nové zážitky a posilňuje vašu vzájomnú lásku."
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
      alt: "Útulné prostredie apartmánu",
      description: "Interiér apartmánu je navrhnutý s dôrazom na pohodlie a romantiku. Každý detail je starostlivo vybratý tak, aby vytvoril harmonické prostredie pre manželské páry. Od mäkkých textílií až po jemné osvetlenie - všetko prispieva k atmosfére lásky a oddychu. Apartmán poskytuje súkromie a kľud potrebný na obnovenie vašej vzájomnej blízkosti. Je to miesto, kde môžete zabudnúť na starosti a sústrediť sa len na seba navzájom."
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
