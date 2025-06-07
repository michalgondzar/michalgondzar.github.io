
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import { useThematicStays } from "@/hooks/useThematicStays";

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

const BookingForm = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedStay, setSelectedStay] = useState("");
  const { stays, updateCounter } = useThematicStays();

  // Convert thematic stays to booking options
  const stayOptions = stays.length > 0 ? stays.map(stay => ({
    id: stay.id,
    label: stay.title,
    description: stay.description.length > 50 ? stay.description.substring(0, 50) + '...' : stay.description
  })) : DEFAULT_STAY_OPTIONS;

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
          
          <div className="space-y-3" key={`stay-options-${updateCounter}`}>
            <Label className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Typ pobytu
            </Label>
            <RadioGroup value={selectedStay} onValueChange={setSelectedStay}>
              {stayOptions.map((option, index) => {
                const uniqueKey = `${option.id}-${updateCounter}-${index}`;
                return (
                  <div key={uniqueKey} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value={option.id} id={uniqueKey} />
                    <div className="flex-1">
                      <Label htmlFor={uniqueKey} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Odoslať nezáväznú rezerváciu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
