
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAvailabilityCheck = () => {
  const [availabilityData, setAvailabilityData] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Načítanie dostupnosti zo servera
  const loadAvailability = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('availability_calendar')
        .select('date, is_available');

      if (error) {
        console.error('Error loading availability:', error);
        return;
      }

      // Konverzia na mapu pre rýchle vyhľadávanie
      const availabilityMap: {[key: string]: boolean} = {};
      data?.forEach(item => {
        availabilityMap[item.date] = item.is_available;
      });
      
      setAvailabilityData(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  // Kontrola dostupnosti konkrétneho dátumu
  const isDateAvailable = (date: string): boolean => {
    // Ak dátum nie je v kalendári dostupnosti, predpokladáme že je voľný
    return availabilityData[date] !== false;
  };

  // Kontrola dostupnosti rozsahu dátumov
  const checkDateRangeAvailability = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generovanie všetkých dátumov v rozsahu
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (!isDateAvailable(dateString)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return true;
  };

  // Validácia a zobrazenie chybových hlášok
  const validateAndShowMessage = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) {
      setErrorMessage(null);
      return true; // Nekontrolujeme ak nie sú vyplnené oba dátumov
    }

    const isAvailable = checkDateRangeAvailability(startDate, endDate);
    
    if (!isAvailable) {
      setErrorMessage("Vybraný termín je obsadený! Prosím vyberte iný termín pre vašu rezerváciu.");
    } else {
      setErrorMessage(null);
    }
    
    return isAvailable;
  };

  return {
    isDateAvailable,
    checkDateRangeAvailability,
    validateAndShowMessage,
    loading,
    errorMessage,
    refreshAvailability: loadAvailability
  };
};
