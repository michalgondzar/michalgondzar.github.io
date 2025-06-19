
import { Heart, Users, Coffee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useThematicStaysDatabase } from "@/hooks/useThematicStaysDatabase";

const ThematicStays = () => {
  const { stays, loading, error } = useThematicStaysDatabase();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Coffee': return Coffee;
      default: return Heart;
    }
  };

  if (loading) {
    return (
      <section id="tematicke-pobyty" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
                Pripravujeme od septembra 2025
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tematické pobyty
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Načítavam pobyty...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tematicke-pobyty" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
                Pripravujeme od septembra 2025
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tematické pobyty
            </h2>
            <p className="text-lg text-red-600 max-w-2xl mx-auto">
              Chyba pri načítavaní pobytov. Skúste obnoviť stránku.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tematicke-pobyty" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
              Pripravujeme od septembra 2025
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tematické pobyty
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vyberte si z našich špeciálne pripravených tematických pobytov, každý prispôsobený rôznym potrebám a príležitostiam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stays.map((stay) => {
            const IconComponent = getIconComponent(stay.icon);
            
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
                      {stay.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center gap-2">
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
