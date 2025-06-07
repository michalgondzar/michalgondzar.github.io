import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Euro, Users, Clock, Heart } from "lucide-react";
import { toast } from "sonner";
import { useContact } from "@/contexts/ContactContext";

interface ThematicStay {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

const DEFAULT_STAY_OPTIONS = [
  { id: "manzelsky", label: "Manželský pobyt", description: "Romantický pobyt pre páry" },
  { id: "rodinny", label: "Rodinný pobyt", description: "Pobyt vhodný pre celú rodinu" },
  { id: "komorka", label: "Pobyt v komôrke", description: "Exkluzívny a pokojný pobyt" }
];

const Booking = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedStay, setSelectedStay] = useState("");
  const [stayOptions, setStayOptions] = useState(DEFAULT_STAY_OPTIONS);
  const { contactData } = useContact();
  const [pricing, setPricing] = useState({
    lowSeason: {
      weekday: "45",
      weekend: "55"
    },
    highSeason: {
      weekday: "65", 
      weekend: "75"
    },
    cleaningFee: "25",
    touristTax: "1.50"
  });

  // Load pricing data from localStorage
  useEffect(() => {
    const savedPricing = localStorage.getItem('apartmentPricing');
    if (savedPricing) {
      try {
        const parsedPricing = JSON.parse(savedPricing);
        setPricing(parsedPricing);
        console.log('Loaded pricing data for booking:', parsedPricing);
      } catch (error) {
        console.error('Error parsing saved pricing for booking:', error);
      }
    }
  }, []);

  // Load thematic stays data
  useEffect(() => {
    loadStayOptions();
    
    // Listen for updates from admin panel
    const handleStorageChange = () => {
      loadStayOptions();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('thematicStaysUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('thematicStaysUpdated', handleStorageChange);
    };
  }, []);

  const loadStayOptions = () => {
    try {
      const savedStays = localStorage.getItem('apartmentThematicStays');
      if (savedStays) {
        const parsedStays: ThematicStay[] = JSON.parse(savedStays);
        const options = parsedStays.map(stay => ({
          id: stay.id,
          label: stay.title,
          description: stay.description.length > 50 ? stay.description.substring(0, 50) + '...' : stay.description
        }));
        setStayOptions(options);
        console.log('Loaded stay options from localStorage:', options);
      } else {
        console.log('No saved thematic stays, using defaults');
        setStayOptions(DEFAULT_STAY_OPTIONS);
      }
    } catch (error) {
      console.error('Error loading stay options:', error);
      setStayOptions(DEFAULT_STAY_OPTIONS);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error("Prosím vyplňte dátum príchodu a odchodu");
      return;
    }
    if (!selectedStay) {
      toast.error("Prosím vyberte typ pobytu");
      return;
    }
    toast.success("Nezáväzná rezervácia bola odoslaná!");
  };

  return (
    <section id="rezervacia" className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Rezervácia a cenník
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vytvorte si nezáväznú rezerváciu alebo si pozrite aktuálne ceny pre váš pobyt
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Nezáväzná rezervácia
              </CardTitle>
              <CardDescription>
                Vyplňte formulár a my vás budeme kontaktovať
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin">Dátum príchodu</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Dátum odchodu</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guests">Počet hostí</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="4"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Typ pobytu
                  </Label>
                  <RadioGroup value={selectedStay} onValueChange={setSelectedStay}>
                    {stayOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Odoslať nezáväznú rezerváciu
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-green-600" />
                Cenník
              </CardTitle>
              <CardDescription>
                Aktuálne ceny za ubytovanie v apartmáne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-gray-800">Nízka sezóna (sep - jún)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Pracovný deň</div>
                    <div className="text-xl font-bold text-blue-600">{pricing.lowSeason.weekday}€</div>
                    <div className="text-xs text-gray-500">za noc</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Víkend</div>
                    <div className="text-xl font-bold text-blue-600">{pricing.lowSeason.weekend}€</div>
                    <div className="text-xs text-gray-500">za noc</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-gray-800">Vysoká sezóna (júl - aug)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Pracovný deň</div>
                    <div className="text-xl font-bold text-green-600">{pricing.highSeason.weekday}€</div>
                    <div className="text-xs text-gray-500">za noc</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Víkend</div>
                    <div className="text-xl font-bold text-green-600">{pricing.highSeason.weekend}€</div>
                    <div className="text-xs text-gray-500">za noc</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-800">Dodatočné poplatky</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pobytová daň (za osobu/noc)</span>
                    <span className="font-semibold">{pricing.touristTax}€</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Dôležité informácie:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Check-in: {contactData.checkinTime}</li>
                      <li>• Check-out: {contactData.checkoutTime}</li>
                      <li>• Minimálny pobyt: 2 noci</li>
                      <li>• Maximálne 4 osoby</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Booking;
