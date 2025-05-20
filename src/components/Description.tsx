
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const features = [
  "Kompletne vybavená kuchyňa",
  "WiFi pripojenie",
  "Parkovanie priamo pri apartmáne",
  "Výhľad na hory",
  "15 minút pešo od aquaparku",
  "Klimatizácia",
  "Detská postieľka na vyžiadanie",
  "Terasa s posedením"
];

const Description = () => {
  return (
    <section id="opis" className="section-container bg-booking-gray/30">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8">
        <h2 className="section-title">Opis apartmánu</h2>
        <p className="section-subtitle">Komfortné ubytovanie pre vašu relaxačnú dovolenku</p>
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              Apartmán Tri víly sa nachádza v pokojnej časti obce Bešeňová, len niekoľko minút od známeho 
              aquaparku. Náš moderný apartmán ponúka všetko, čo potrebujete pre dokonalý pobyt 
              v tejto turisticky atraktívnej lokalite.
            </p>
            
            <p className="text-lg text-gray-700">
              Apartmán je vhodný pre páry aj rodiny s deťmi. Ponúka priestranný obývací priestor 
              s plne vybavenou kuchyňou, samostatnú spálňu a moderné sociálne zariadenie. 
              Z terasy si môžete vychutnávať krásny výhľad na okolitú prírodu.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {features.map((feature, index) => (
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
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" 
                  alt="Apartmán obývačka" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a" 
                  alt="Apartmán kuchyňa" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd" 
                  alt="Apartmán spálňa" 
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
