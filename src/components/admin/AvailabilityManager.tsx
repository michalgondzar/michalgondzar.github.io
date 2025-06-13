
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvailabilityData {
  date: string;
  is_available: boolean;
}

export const AvailabilityManager = () => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      
      // Set selected dates to unavailable dates
      const unavailableDates = data?.filter(item => !item.is_available).map(item => new Date(item.date)) || [];
      setSelectedDates(unavailableDates);
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
    return availability ? availability.is_available : true;
  };

  // Custom day renderer with color coding
  const dayClassName = (date: Date) => {
    const isAvailable = isDateAvailable(date);
    const baseClasses = "h-9 w-9 p-0 font-normal";
    
    if (isAvailable) {
      return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-200`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800 hover:bg-red-200`;
    }
  };

  // Save availability changes
  const saveAvailability = async () => {
    setSaving(true);
    try {
      // Get all dates that should be marked as unavailable
      const unavailableDates = selectedDates.map(date => ({
        date: date.toISOString().split('T')[0],
        is_available: false
      }));

      // Get existing unavailable dates that are no longer selected
      const existingUnavailableDates = availabilityData
        .filter(item => !item.is_available)
        .map(item => item.date);

      const newlySelectedDates = selectedDates.map(date => date.toISOString().split('T')[0]);
      const datesToMakeAvailable = existingUnavailableDates.filter(date => !newlySelectedDates.includes(date));

      // Update dates to available
      for (const date of datesToMakeAvailable) {
        const { error } = await supabase
          .from('availability_calendar')
          .upsert({
            date,
            is_available: true
          });

        if (error) {
          console.error('Error updating availability:', error);
          toast.error('Chyba pri aktualizácii dostupnosti');
          return;
        }
      }

      // Update dates to unavailable
      for (const unavailableDate of unavailableDates) {
        const { error } = await supabase
          .from('availability_calendar')
          .upsert(unavailableDate);

        if (error) {
          console.error('Error updating availability:', error);
          toast.error('Chyba pri aktualizácii dostupnosti');
          return;
        }
      }

      toast.success('Kalendár obsadenosti bol aktualizovaný');
      loadAvailabilityData(); // Reload to reflect changes
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Chyba pri ukladaní kalendára obsadenosti');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="text-booking-primary" />
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="text-booking-primary" />
          Správa kalendára obsadenosti
        </CardTitle>
        <CardDescription>
          Označte obsadené termíny kliknutím na dátumy. Červené = obsadené, zelené = voľné.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            className="rounded-md border"
            classNames={{
              day: dayClassName,
            }}
            fromDate={new Date()}
            showOutsideDays={false}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Voľné termíny</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Obsadené termíny (kliknite pre označenie)</span>
            </div>
          </div>

          <Button 
            onClick={saveAvailability}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? "Ukladám..." : "Uložiť kalendár obsadenosti"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
