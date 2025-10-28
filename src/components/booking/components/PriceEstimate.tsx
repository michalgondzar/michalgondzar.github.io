
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePriceCalculator } from "../hooks/usePriceCalculator";
import { useCouponValidation } from "../hooks/useCouponValidation";

interface PriceEstimateProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  couponCode?: string;
}

export const PriceEstimate = ({ checkIn, checkOut, guests, couponCode = "" }: PriceEstimateProps) => {
  const { calculatePrice, pricing } = usePriceCalculator();
  
  // Calculate nights first for coupon validation
  const startDate = checkIn ? new Date(checkIn) : null;
  const endDate = checkOut ? new Date(checkOut) : null;
  const numberOfNights = startDate && endDate && startDate < endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Validate coupon
  const { isValid, discount, discountType, errorMessage, loading: couponLoading } = useCouponValidation(
    couponCode, 
    numberOfNights
  );
  
  // Calculate price with coupon discount
  const calculation = calculatePrice(
    checkIn, 
    checkOut, 
    guests,
    isValid && discount > 0 ? { type: discountType!, value: discount } : undefined
  );

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
          {calculation.breakdown.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Zľava ({couponCode.toUpperCase()}):</span>
              <span className="font-medium">-{calculation.breakdown.discountAmount.toFixed(2)}€</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Celkom:</span>
            <span>{calculation.totalPrice.toFixed(2)}€</span>
          </div>
        </div>
        
        {/* Coupon status badge */}
        {couponCode && (
          <div className="mt-3">
            {couponLoading ? (
              <Badge variant="outline" className="w-full justify-center">
                Overujem kupón...
              </Badge>
            ) : isValid ? (
              <Badge className="w-full justify-center bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Kupón aplikovaný ({discountType === 'percentage' ? `${discount}%` : `${discount}€`})
              </Badge>
            ) : errorMessage ? (
              <Badge variant="destructive" className="w-full justify-center">
                <XCircle className="h-3 w-3 mr-1" />
                {errorMessage}
              </Badge>
            ) : null}
          </div>
        )}
        
        <div className="text-xs text-gray-500 text-center">
          * Predbežný prepočet. Konečná cena môže byť ovplyvnená zľavovými kupónmi alebo inými faktormi.
        </div>
      </CardContent>
    </Card>
  );
};
