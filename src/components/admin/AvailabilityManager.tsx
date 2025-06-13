
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvailabilityData {
  date: string;
  is_available: boolean;
}

const AvailabilityManager = () => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Load availability data from database
  const loadAvailabilityData = async () => {
    try {
      const { data, error } = await supabase
        .from('availability_calendar')
        .select('date, is_available');

      if (error) {
        console.error('Error loading availability data:', error);
        toast.error('Chyba pri načítavaní kalendára obsadenosti');
        return;
      }

      setAvailabilityData(data || []);
    } catch (error) {
      console.error('Error loading availability data:', error);
      toast.error('Chyba pri načítavaní kalendára obsadenosti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  // Function to determine if a date is available (default to available if not in database)
  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const availability = availabilityData.find(item => item.date === dateString);
    return availability ? availability.is_available : true; // Default to available
  };

  // Toggle availability for selected date
  const toggleAvailability = async (available: boolean) => {
    if (!selectedDate) {
      toast.error('Prosím vyberte dátum');
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];
    
    try {
      const { error } = await supabase
        .from('availability_calendar')
        .upsert({
          date: dateString,
          is_available: available
        }, {
          onConflict: 'date'
        });

      if (error) {
        console.error('Error updating availability:', error);
        toast.error('Chyba pri aktualizácii dostupnosti');
        return;
      }

      // Refresh data
      await loadAvailabilityData();
      toast.success(`Dátum ${dateString} označený ako ${available ? 'voľný' : 'obsadený'}`);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Chyba pri aktualizácii dostupnosti');
    }
  };

  // Custom day renderer with color coding
  const getModifiers = () => {
    const available: Date[] = [];
    const unavailable: Date[] = [];
    
    availabilityData.forEach(item => {
      const date = new Date(item.date);
      if (item.is_available) {
        available.push(date);
      } else {
        unavailable.push(date);
      }
    });
    
    return { available, unavailable };
  };

  const modifiers = getModifiers();
  const modifiersClassNames = {
    available: "bg-green-100 text-green-800 hover:bg-green-200",
    unavailable: "bg-red-100 text-red-800 hover:bg-red-200"
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Správa kalendára dostupnosti
          </CardTitle>
          <CardDescription>
            Načítavam kalendár...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Správa kalendára dostupnosti
        </CardTitle>
        <CardDescription>
          Označte termíny ako voľné alebo obsadené. Všetky termíny sú defaultne voľné.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays={false}
              fromDate={new Date()}
            />
          </div>
          
          <div className="lg:w-80 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Vybraný dátum</h3>
              {selectedDate ? (
                <p className="text-sm text-gray-600">
                  {selectedDate.toLocaleDateString('sk-SK')}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Žiadny dátum nevybraný</p>
              )}
            </div>
            
            {selectedDate && (
              <div className="space-y-2">
                <p className="text-sm">
                  Aktuálny stav: <span className={isDateAvailable(selectedDate) ? "text-green-600" : "text-red-600"}>
                    {isDateAvailable(selectedDate) ? 'Voľný' : 'Obsadený'}
                  </span>
                </p>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => toggleAvailability(true)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isDateAvailable(selectedDate)}
                  >
                    Označiť ako voľný
                  </Button>
                  <Button 
                    onClick={() => toggleAvailability(false)}
                    variant="destructive"
                    disabled={!isDateAvailable(selectedDate)}
                  >
                    Označiť ako obsadený
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 text-sm border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Voľné termíny</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Obsadené termíny</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Defaultne voľné (neoznačené)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityManager;
