
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { googleCalendarService } from "@/utils/googleCalendar";

interface GoogleCalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: any[];
}

export const GoogleCalendarDialog = ({ isOpen, onClose, bookings }: GoogleCalendarDialogProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Skontrolujeme či je používateľ už prihlásený
    const checkConnection = async () => {
      const initialized = await googleCalendarService.initializeGapi();
      if (initialized) {
        setIsConnected(googleCalendarService.isSignedIn());
      }
    };
    
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const success = await googleCalendarService.signIn();
      
      if (success) {
        setIsConnected(true);
        toast.success("Úspešne pripojené k Google Kalendáru!", {
          description: "Teraz môžete synchronizovať rezervácie"
        });
      } else {
        toast.error("Nepodarilo sa pripojiť k Google Kalendáru", {
          description: "Skontrolujte prosím vaše nastavenia"
        });
      }
    } catch (error) {
      console.error('Chyba pri pripojení:', error);
      toast.error("Chyba pri pripojení", {
        description: "Skontrolujte či máte nakonfigurované API kľúče"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await googleCalendarService.signOut();
      setIsConnected(false);
      toast.info("Odpojené od Google Kalendára");
    } catch (error) {
      console.error('Chyba pri odpojení:', error);
      toast.error("Chyba pri odpojení");
    }
  };

  const handleSync = async () => {
    if (!isConnected) {
      toast.error("Najprv sa pripojte k Google Kalendáru");
      return;
    }

    setIsSyncing(true);
    
    try {
      const success = await googleCalendarService.syncBookings(bookings);
      
      if (success) {
        toast.success("Rezervácie úspešne synchronizované!", {
          description: `Synchronizovaných ${bookings.length} rezervácií`
        });
      } else {
        toast.error("Nepodarilo sa synchronizovať rezervácie");
      }
    } catch (error) {
      console.error('Chyba pri synchronizácii:', error);
      toast.error("Chyba pri synchronizácii");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="text-booking-primary" size={20} />
            Google Kalendár Integrácia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stav pripojenia */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            {isConnected ? (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="font-medium text-green-700">Pripojené</p>
                  <p className="text-sm text-gray-600">Google Kalendár je pripojený</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="text-orange-500" size={20} />
                <div>
                  <p className="font-medium text-orange-700">Nepripojené</p>
                  <p className="text-sm text-gray-600">Pripojte sa k Google Kalendáru</p>
                </div>
              </>
            )}
          </div>

          {/* Konfigurácia API kľúčov */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Nastavenie API kľúčov</h3>
            <p className="text-sm text-gray-600 mb-3">
              Pre fungovanie integrácie potrebujete nakonfigurovať:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• VITE_GOOGLE_CALENDAR_API_KEY</li>
              <li>• VITE_GOOGLE_CLIENT_ID</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Získajte ich v Google Cloud Console
            </p>
          </div>

          {/* Akcie */}
          <div className="space-y-3">
            {!isConnected ? (
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pripojiť Google Kalendár
              </Button>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Synchronizovať rezervácie ({bookings.length})
                </Button>
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full"
                >
                  Odpojiť
                </Button>
              </div>
            )}
          </div>

          <Button onClick={onClose} variant="ghost" className="w-full">
            Zavrieť
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
