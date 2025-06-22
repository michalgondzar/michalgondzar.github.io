
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarSyncDialog } from "./CalendarSyncDialog";
import AutoSyncStatus from "./AutoSyncStatus";

interface AvailabilityData {
  date: string;
  is_available: boolean;
}

const AvailabilityManager = () => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);

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

  // Handle single date selection (toggle)
  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDates(prev => {
      const dateExists = prev.some(d => d.toDateString() === date.toDateString());
      if (dateExists) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date];
      }
    });
  };

  // Bulk toggle availability for all selected dates
  const bulkToggleAvailability = async (available: boolean) => {
    if (selectedDates.length === 0) {
      toast.error('Prosím vyberte aspoň jeden dátum');
      return;
    }

    try {
      const updates = selectedDates.map(date => ({
        date: date.toISOString().split('T')[0],
        is_available: available
      }));

      const { error } = await supabase
        .from('availability_calendar')
        .upsert(updates, {
          onConflict: 'date'
        });

      if (error) {
        console.error('Error updating availability:', error);
        toast.error('Chyba pri aktualizácii dostupnosti');
        return;
      }

      // Refresh data
      await loadAvailabilityData();
      toast.success(`${selectedDates.length} dátumov označených ako ${available ? 'voľné' : 'obsadené'}`);
      setSelectedDates([]); // Clear selection
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Chyba pri aktualizácii dostupnosti');
    }
  };

  // Clear selected dates
  const clearSelection = () => {
    setSelectedDates([]);
  };

  // Custom day renderer with color coding
  const getModifiers = () => {
    const unavailable: Date[] = [];
    const selected: Date[] = selectedDates;
    
    availabilityData.forEach(item => {
      if (!item.is_available) {
        const date = new Date(item.date);
        unavailable.push(date);
      }
    });
    
    return { unavailable, selected };
  };

  const modifiers = getModifiers();
  const modifiersClassNames = {
    unavailable: "bg-red-100 text-red-800 hover:bg-red-200",
    selected: "bg-blue-100 text-blue-800 hover:bg-blue-200 ring-2 ring-blue-500"
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
    <>
      <AutoSyncStatus />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Správa kalendára dostupnosti
          </CardTitle>
          <CardDescription>
            Kliknite na dátum pre výber/zrušenie výberu. Môžete vybrať viacero dátumov naraz a hromadne ich označiť.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => setSyncDialogOpen(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Manuálna synchronizácia
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Calendar
                mode="single"
                onSelect={handleDateClick}
                className="rounded-md border"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                showOutsideDays={false}
                fromDate={new Date()}
              />
            </div>
            
            <div className="lg:w-80 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Vybrané dátumov: {selectedDates.length}</h3>
                {selectedDates.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedDates.map((date, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {date.toLocaleDateString('sk-SK')}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Žiadne dátumov nevybrané</p>
                )}
              </div>
              
              {selectedDates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => bulkToggleAvailability(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Označiť všetky ako voľné ({selectedDates.length})
                    </Button>
                    <Button 
                      onClick={() => bulkToggleAvailability(false)}
                      variant="destructive"
                    >
                      Označiť všetky ako obsadené ({selectedDates.length})
                    </Button>
                    <Button 
                      onClick={clearSelection}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Zrušiť výber
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Obsadené termíny</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>Voľné termíny</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded ring-1 ring-blue-500"></div>
              <span>Vybrané dátumov</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CalendarSyncDialog
        isOpen={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        onSync={loadAvailabilityData}
      />
    </>
  );
};

export default AvailabilityManager;
