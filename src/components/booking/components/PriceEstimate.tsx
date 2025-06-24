
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Euro } from "lucide-react";
import { usePriceCalculator } from "../hooks/usePriceCalculator";

interface PriceEstimateProps {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export const PriceEstimate = ({ checkIn, checkOut, guests }: PriceEstimateProps) => {
  const { calculatePrice, pricing } = usePriceCalculator();
  
  const calculation = calculatePrice(checkIn, checkOut, guests);

  if (!calculation) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-500">
            <Calculator className="h-5 w-5" />
            Predbežný prepočet ceny
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Vyberte dátum príchodu a odchodu pre zobrazenie predbežnej ceny
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Calculator className="h-5 w-5" />
          Predbežný prepočet ceny
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-700">
            {calculation.totalPrice.toFixed(2)}€
          </div>
          <div className="text-sm text-gray-600">
            {calculation.numberOfNights} {calculation.numberOfNights === 1 ? 'noc' : 
             calculation.numberOfNights <= 4 ? 'noci' : 'nocí'}
            {calculation.isHighSeason && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                Vysoká sezóna
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ubytovanie:</span>
            <span className="font-medium">{calculation.breakdown.accommodationCost.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span>Pobytová daň ({guests} x {calculation.numberOfNights} x {pricing.touristTax}€):</span>
            <span className="font-medium">{calculation.breakdown.touristTaxCost.toFixed(2)}€</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Celkom:</span>
            <span>{calculation.totalPrice.toFixed(2)}€</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          * Predbežný prepočet. Konečná cena môže byť ovplyvnená zľavovými kupónmi alebo inými faktormi.
        </div>
      </CardContent>
    </Card>
  );
};
