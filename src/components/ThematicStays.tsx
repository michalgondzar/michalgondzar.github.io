
import { Heart, Users, Coffee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThematicStays } from "@/hooks/useThematicStays";
import { useEffect, useState } from "react";

const ThematicStays = () => {
  const { stays, updateCounter } = useThematicStays();
  const [forceRenderKey, setForceRenderKey] = useState(0);

  // Additional effect to listen for external updates
  useEffect(() => {
    const handleExternalUpdate = () => {
      console.log('External update detected in ThematicStays');
      setForceRenderKey(prev => prev + 1);
    };

    // Listen for multiple types of update events
    window.addEventListener('thematicStaysUpdated', handleExternalUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'apartmentThematicStays') {
        handleExternalUpdate();
      }
    });

    // BroadcastChannel listener
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('thematic-stays-updates');
      broadcastChannel.addEventListener('message', handleExternalUpdate);
    }

    return () => {
      window.removeEventListener('thematicStaysUpdated', handleExternalUpdate);
      window.removeEventListener('storage', handleExternalUpdate);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleExternalUpdate);
        broadcastChannel.close();
      }
    };
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Coffee': return Coffee;
      default: return Heart;
    }
  };

  // Enhanced render key for forcing updates
  const renderKey = `stays-${updateCounter}-${forceRenderKey}-${Date.now()}`;

  return (
    <section id="tematicke-pobyty" className="py-16 bg-gradient-to-br from-green-50 to-blue-50" key={renderKey}>
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
          {stays.map((stay, index) => {
            const IconComponent = getIconComponent(stay.icon);
            const uniqueKey = `${stay.id}-${updateCounter}-${forceRenderKey}-${index}`;
            
            return (
              <Card key={uniqueKey} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={stay.image} 
                    alt={stay.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    key={`img-${uniqueKey}`}
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
                        <li key={`${uniqueKey}-feature-${featureIndex}`} className="text-sm text-gray-600 flex items-center gap-2">
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
