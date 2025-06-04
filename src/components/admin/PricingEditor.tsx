
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Euro, Save } from "lucide-react";

export const PricingEditor = () => {
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

  // Load pricing data from localStorage on component mount
  useEffect(() => {
    const savedPricing = localStorage.getItem('apartmentPricing');
    if (savedPricing) {
      try {
        const parsedPricing = JSON.parse(savedPricing);
        setPricing(parsedPricing);
        console.log('Loaded pricing from localStorage:', parsedPricing);
      } catch (error) {
        console.error('Error parsing saved pricing:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('apartmentPricing', JSON.stringify(pricing));
    console.log('Saving pricing to localStorage:', pricing);
    toast.success("Cenník bol úspešne uložený");
  };

  const updatePrice = (season: 'lowSeason' | 'highSeason', type: 'weekday' | 'weekend', value: string) => {
    setPricing(prev => ({
      ...prev,
      [season]: {
        ...prev[season],
        [type]: value
      }
    }));
  };

  const updateFee = (type: 'cleaningFee' | 'touristTax', value: string) => {
    setPricing(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Euro className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">Správa cenníka</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nízka sezóna */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nízka sezóna</CardTitle>
            <CardDescription>Ceny pre nízku sezónu (september - jún)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="low-weekday">Pracovný deň (€/noc)</Label>
              <Input
                id="low-weekday"
                type="number"
                value={pricing.lowSeason.weekday}
                onChange={(e) => updatePrice('lowSeason', 'weekday', e.target.value)}
                placeholder="45"
              />
            </div>
            <div>
              <Label htmlFor="low-weekend">Víkend (€/noc)</Label>
              <Input
                id="low-weekend"
                type="number"
                value={pricing.lowSeason.weekend}
                onChange={(e) => updatePrice('lowSeason', 'weekend', e.target.value)}
                placeholder="55"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vysoká sezóna */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vysoká sezóna</CardTitle>
            <CardDescription>Ceny pre vysokú sezónu (júl - august)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="high-weekday">Pracovný deň (€/noc)</Label>
              <Input
                id="high-weekday"
                type="number"
                value={pricing.highSeason.weekday}
                onChange={(e) => updatePrice('highSeason', 'weekday', e.target.value)}
                placeholder="65"
              />
            </div>
            <div>
              <Label htmlFor="high-weekend">Víkend (€/noc)</Label>
              <Input
                id="high-weekend"
                type="number"
                value={pricing.highSeason.weekend}
                onChange={(e) => updatePrice('highSeason', 'weekend', e.target.value)}
                placeholder="75"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dodatočné poplatky */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dodatočné poplatky</CardTitle>
          <CardDescription>Ostatné poplatky a služby</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tourist-tax">Pobytová daň na osobu/noc (€)</Label>
            <Input
              id="tourist-tax"
              type="number"
              step="0.01"
              value={pricing.touristTax}
              onChange={(e) => updateFee('touristTax', e.target.value)}
              placeholder="1.50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uložiť */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Uložiť cenník
        </Button>
      </div>
    </div>
  );
};
