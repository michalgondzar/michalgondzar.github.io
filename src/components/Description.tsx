
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Vytvorené ako samostatné premenné, ktoré môžeme neskôr aktualizovať cez admin rozhranie
export const apartmentDescription = {
  title: "Opis apartmánu",
  subtitle: "Komfortné ubytovanie pre vašu relaxačnú dovolenku",
  paragraph1: "Apartmán Tri víly sa nachádza v pokojnej časti obce Bešeňová, len niekoľko minút od známeho aquaparku. Náš moderný apartmán ponúka všetko, čo potrebujete pre dokonalý pobyt v tejto turisticky atraktívnej lokalite.",
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
      src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      alt: "Apartmán obývačka"
    },
    {
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
      alt: "Apartmán kuchyňa"
    },
    {
      src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      alt: "Apartmán spálňa"
    }
  ]
};

const Description = () => {
  return (
    <section id="opis" className="section-container bg-booking-gray/30">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8">
        <h2 className="section-title">{apartmentDescription.title}</h2>
        <p className="section-subtitle">{apartmentDescription.subtitle}</p>
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              {apartmentDescription.paragraph1}
            </p>
            
            <p className="text-lg text-gray-700">
              {apartmentDescription.paragraph2}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {apartmentDescription.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-booking-primary" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-2">
              <CardContent className="p-0">
                <img 
                  src={apartmentDescription.images[0].src}
                  alt={apartmentDescription.images[0].alt}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <img 
                  src={apartmentDescription.images[1].src}
                  alt={apartmentDescription.images[1].alt}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <img 
                  src={apartmentDescription.images[2].src}
                  alt={apartmentDescription.images[2].alt}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Description;
