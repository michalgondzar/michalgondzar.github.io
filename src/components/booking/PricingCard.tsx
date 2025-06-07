
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Clock } from "lucide-react";
import { useContact } from "@/contexts/ContactContext";

const PricingCard = () => {
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

  return (
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
  );
};

export default PricingCard;
