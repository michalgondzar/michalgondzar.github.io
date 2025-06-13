
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvailabilityData {
  date: string;
  is_available: boolean;
}

const AvailabilityCalendar = () => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
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

  // Function to determine if a date is available
  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const availability = availabilityData.find(item => item.date === dateString);
    return availability ? availability.is_available : true; // Default to available if not in database
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
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Kalendár obsadenosti
          </CardTitle>
          <CardDescription>
            Načítavam kalendár...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Kalendár obsadenosti
        </CardTitle>
        <CardDescription>
          Pozrite si dostupné termíny pre váš pobyt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Calendar
            mode="single"
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            fromDate={new Date()}
            showOutsideDays={false}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Voľné termíny</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Obsadené termíny</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
