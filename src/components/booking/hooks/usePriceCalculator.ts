
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PricingData {
  lowSeason: {
    weekday: string;
    weekend: string;
  };
  highSeason: {
    weekday: string;
    weekend: string;
  };
  touristTax: string;
}

interface PriceCalculation {
  totalPrice: number;
  numberOfNights: number;
  breakdown: {
    accommodationCost: number;
    touristTaxCost: number;
  };
  isHighSeason: boolean;
}

export const usePriceCalculator = () => {
  const [pricing, setPricing] = useState<PricingData>({
    lowSeason: { weekday: "45", weekend: "55" },
    highSeason: { weekday: "65", weekend: "75" },
    touristTax: "1.50"
  });

  // Load pricing data from database
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const { data, error } = await supabase
          .from('pricing')
          .select('*')
          .eq('id', 1)
          .single();

        if (data && !error) {
          setPricing({
            lowSeason: {
              weekday: data.low_season_weekday,
              weekend: data.low_season_weekend
            },
            highSeason: {
              weekday: data.high_season_weekday,
              weekend: data.high_season_weekend
            },
            touristTax: data.tourist_tax
          });
        }
      } catch (error) {
        console.error('Error loading pricing:', error);
      }
    };

    loadPricing();
  }, []);

  const calculatePrice = (checkIn: string, checkOut: string, guests: number): PriceCalculation | null => {
    if (!checkIn || !checkOut) return null;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    
    if (startDate >= endDate) return null;

    const numberOfNights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let accommodationCost = 0;

    // Calculate cost for each night
    for (let i = 0; i < numberOfNights; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      
      // High season: July (7) and August (8)
      const isHighSeason = month === 7 || month === 8;
      // Weekend: Friday (5), Saturday (6), Sunday (0)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      
      let nightPrice: number;
      if (isHighSeason) {
        nightPrice = parseFloat(isWeekend ? pricing.highSeason.weekend : pricing.highSeason.weekday);
      } else {
        nightPrice = parseFloat(isWeekend ? pricing.lowSeason.weekend : pricing.lowSeason.weekday);
      }
      
      accommodationCost += nightPrice;
    }

    const touristTaxCost = guests * numberOfNights * parseFloat(pricing.touristTax);
    const totalPrice = accommodationCost + touristTaxCost;

    // Determine if any night falls in high season
    const isHighSeason = Array.from({ length: numberOfNights }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const month = date.getMonth() + 1;
      return month === 7 || month === 8;
    }).some(Boolean);

    return {
      totalPrice,
      numberOfNights,
      breakdown: {
        accommodationCost,
        touristTaxCost
      },
      isHighSeason
    };
  };

  return { calculatePrice, pricing };
};
