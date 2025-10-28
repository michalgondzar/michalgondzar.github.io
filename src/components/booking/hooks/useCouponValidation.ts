import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Coupon {
  code: string;
  discount_type: string;
  discount_value: number;
  min_stay_nights: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
}

interface CouponValidationResult {
  isValid: boolean;
  coupon: Coupon | null;
  discount: number;
  discountType: 'percentage' | 'fixed' | null;
  errorMessage: string | null;
}

export const useCouponValidation = (couponCode: string, numberOfNights: number) => {
  const [result, setResult] = useState<CouponValidationResult>({
    isValid: false,
    coupon: null,
    discount: 0,
    discountType: null,
    errorMessage: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateCoupon = async () => {
      // Reset if no coupon code
      if (!couponCode || couponCode.trim() === '') {
        setResult({
          isValid: false,
          coupon: null,
          discount: 0,
          discountType: null,
          errorMessage: null,
        });
        return;
      }

      setLoading(true);

      try {
        const { data: coupon, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.trim().toUpperCase())
          .single();

        if (error || !coupon) {
          setResult({
            isValid: false,
            coupon: null,
            discount: 0,
            discountType: null,
            errorMessage: 'Kupón neexistuje',
          });
          return;
        }

        // Validate active status
        if (!coupon.is_active) {
          setResult({
            isValid: false,
            coupon,
            discount: 0,
            discountType: null,
            errorMessage: 'Kupón už nie je aktívny',
          });
          return;
        }

        // Validate date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const validFrom = new Date(coupon.valid_from);
        const validTo = new Date(coupon.valid_to);

        if (today < validFrom || today > validTo) {
          setResult({
            isValid: false,
            coupon,
            discount: 0,
            discountType: null,
            errorMessage: 'Kupón nie je platný v tomto období',
          });
          return;
        }

        // Validate usage limit
        if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
          setResult({
            isValid: false,
            coupon,
            discount: 0,
            discountType: null,
            errorMessage: 'Kupón dosiahol limit použití',
          });
          return;
        }

        // Validate minimum stay nights
        if (numberOfNights > 0 && numberOfNights < coupon.min_stay_nights) {
          setResult({
            isValid: false,
            coupon,
            discount: 0,
            discountType: null,
            errorMessage: `Kupón vyžaduje minimálne ${coupon.min_stay_nights} ${
              coupon.min_stay_nights === 1 ? 'noc' : 
              coupon.min_stay_nights <= 4 ? 'noci' : 'nocí'
            }`,
          });
          return;
        }

        // All validations passed
        setResult({
          isValid: true,
          coupon,
          discount: parseFloat(coupon.discount_value.toString()),
          discountType: coupon.discount_type as 'percentage' | 'fixed',
          errorMessage: null,
        });
      } catch (error) {
        console.error('Error validating coupon:', error);
        setResult({
          isValid: false,
          coupon: null,
          discount: 0,
          discountType: null,
          errorMessage: 'Chyba pri overovaní kupónu',
        });
      } finally {
        setLoading(false);
      }
    };

    // Debounce the validation
    const timeoutId = setTimeout(validateCoupon, 500);
    return () => clearTimeout(timeoutId);
  }, [couponCode, numberOfNights]);

  return { ...result, loading };
};
