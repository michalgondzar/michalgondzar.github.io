
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Coffee } from "lucide-react";

const ThematicStays = () => {
  const stayTypes = [
    {
      id: "manzelsky",
      title: "Manželský pobyt",
      description: "Romantický pobyt pre páry s možnosťou relaxu a súkromia. Ideálny na oslavu výročia alebo jednoducho na strávenie kvalitného času spolu.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      icon: Heart,
      features: ["Romantická atmosféra", "Súkromie", "Relaxácia pre dvoch"]
    },
    {
      id: "rodinny",
      title: "Rodinný pobyt",
      description: "Pobyt vhodný pre celú rodinu s deťmi. Priestranný apartmán s pohodlným ubytovaním a blízkosťou k rodinným aktivitám.",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      icon: Users,
      features: ["Vhodné pre deti", "Priestranný apartmán", "Rodinné aktivity"]
    },
    {
      id: "komorka",
      title: "Pobyt v komôrke",
      description: "Exkluzívny a pokojný pobyt v tichej časti apartmánu. Ideálny pre tých, ktorí hľadajú úplné súkromie a relaxáciu.",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
      icon: Coffee,
      features: ["Absolútne súkromie", "Tichá lokalita", "Relaxačná atmosféra"]
    }
  ];

  return (
    <section id="tematicke-pobyty" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tematické pobyty
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vyberte si z našich špeciálne pripravených tematických pobytov, každý prispôsobený rôznym potrebám a príležitostiam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stayTypes.map((stay) => {
            const IconComponent = stay.icon;
            return (
              <Card key={stay.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={stay.image} 
                    alt={stay.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {stay.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {stay.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Čo vás čaká:</h4>
                    <ul className="space-y-1">
                      {stay.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThematicStays;
