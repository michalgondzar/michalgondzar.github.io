
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

const AvailabilitySection = () => {
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

  // Custom day renderer with color coding - only show unavailable dates in red
  const getModifiers = () => {
    const unavailable: Date[] = [];
    
    availabilityData.forEach(item => {
      if (!item.is_available) {
        const date = new Date(item.date);
        unavailable.push(date);
      }
    });
    
    return { unavailable };
  };

  const modifiers = getModifiers();
  const modifiersClassNames = {
    unavailable: "bg-red-100 text-red-800 hover:bg-red-200"
  };

  if (loading) {
    return (
      <section className="section-container bg-white">
        <div className="text-center mb-12">
          <h2 className="section-title">Kalendár obsadenosti</h2>
          <p className="section-subtitle">
            Načítavam kalendár...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container bg-white">
      <div className="text-center mb-12">
        <h2 className="section-title">Kalendár obsadenosti</h2>
        <p className="section-subtitle">
          Pozrite si dostupné termíny pre váš pobyt
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Dostupné termíny
            </CardTitle>
            <CardDescription className="text-center">
              Červenou farbou sú označené obsadené termíny. Ostatné termíny sú voľné.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
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
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Obsadené termíny</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Voľné termíny</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AvailabilitySection;
