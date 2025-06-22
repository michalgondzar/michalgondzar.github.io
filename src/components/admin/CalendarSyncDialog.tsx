
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseICalData, convertICalDateToLocalDate, getDatesInRange } from "@/utils/icalParser";

interface CalendarSyncDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: () => void;
}

export const CalendarSyncDialog = ({ isOpen, onClose, onSync }: CalendarSyncDialogProps) => {
  const [icalUrl, setIcalUrl] = useState("https://ical.booking.com/v1/export?t=38af27a7-67ee-4b15-b329-505a369d9ea4");
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (!icalUrl.trim()) {
      toast.error("Prosím zadajte iCal URL");
      return;
    }

    setIsLoading(true);
    
    try {
      // Fetch iCal data from URL
      const response = await fetch(icalUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const icalData = await response.text();
      console.log('iCal data fetched:', icalData.substring(0, 200) + '...');
      
      // Parse iCal data
      const events = parseICalData(icalData);
      console.log('Parsed events:', events);
      
      if (events.length === 0) {
        toast.info("V kalendári neboli nájdené žiadne udalosti");
        return;
      }

      // Convert events to availability updates
      const availabilityUpdates: Array<{ date: string; is_available: boolean }> = [];
      
      events.forEach(event => {
        const startDate = convertICalDateToLocalDate(event.dtstart);
        const endDate = convertICalDateToLocalDate(event.dtend);
        
        // Získaj všetky dátumy v rozsahu udalosti
        const datesInRange = getDatesInRange(startDate, endDate);
        
        datesInRange.forEach(date => {
          availabilityUpdates.push({
            date,
            is_available: false // Označiť ako obsadené
          });
        });
      });

      console.log('Availability updates:', availabilityUpdates);

      // Update database
      if (availabilityUpdates.length > 0) {
        const { error } = await supabase
          .from('availability_calendar')
          .upsert(availabilityUpdates, {
            onConflict: 'date'
          });

        if (error) {
          console.error('Error updating availability:', error);
          toast.error('Chyba pri aktualizácii dostupnosti');
          return;
        }

        toast.success(`Úspešne synchronizovaných ${availabilityUpdates.length} dátumov z kalendára`, {
          description: `Nájdené ${events.length} udalostí`
        });
        
        onSync(); // Refresh parent data
        onClose();
      } else {
        toast.info("Žiadne dátumy na synchronizáciu");
      }
      
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast.error("Chyba pri synchronizácii kalendára", {
        description: "Skontrolujte prosím URL kalendára a internetové pripojenie"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Synchronizovať s externým kalendárom
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ical-url">iCal URL (Booking.com, Airbnb, etc.)</Label>
            <Input
              id="ical-url"
              type="url"
              value={icalUrl}
              onChange={(e) => setIcalUrl(e.target.value)}
              placeholder="https://ical.booking.com/v1/export?t=..."
            />
            <p className="text-xs text-gray-500">
              Zadajte iCal URL z vašej rezervačnej platformy
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-medium mb-2 text-blue-800">Ako na to:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Booking.com: Extranet → Calendar → Export calendar</li>
              <li>• Airbnb: Host → Calendar → Sync calendars → Export</li>
              <li>• Všetky obsadené termíny budú označené ako nedostupné</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSync} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Synchronizovať kalendár
            </Button>
            
            <Button onClick={onClose} variant="outline" className="w-full">
              Zrušiť
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
