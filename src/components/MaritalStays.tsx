
import { useState } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Predvolené údaje pre sekciu manželských pobytov
export const maritalStaysData = {
  title: "Manželské pobyty",
  description: "Doprajte si romantický pobyt v útulnom prostredí nášho apartmánu. Vytvorte si nezabudnuteľné chvíle s vašou láskou v krásnom prostredí Bešeňovej.",
  images: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      alt: "Romantická obývacia izba"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      alt: "Krásne okolie pre romantické prechádzky"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
      alt: "Útulné prostredie apartmánu"
    }
  ],
  externalLink: "https://www.manzelkepobyty.sk"
};

const MaritalStays = () => {
  return (
    <section id="manzelske-pobyty" className="bg-white py-16">
      <div className="section-container">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500" />
            <h2 className="section-title mb-0">{maritalStaysData.title}</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {maritalStaysData.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {maritalStaysData.images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 bg-white text-center text-sm text-gray-600">
                  {image.alt}
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
                href={maritalStaysData.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Navštíviť manzelkepobyty.sk
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
