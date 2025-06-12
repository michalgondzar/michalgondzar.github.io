import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Heart, Tag } from "lucide-react";
import { toast } from "sonner";
import { useThematicStaysDatabase } from "@/hooks/useThematicStaysDatabase";
import { supabase } from "@/integrations/supabase/client";

interface ThematicStay {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

const DEFAULT_STAY_OPTIONS = [
  { id: "manzelsky", label: "Manželský pobyt", description: "Romantický pobyt pre páry" },
  { id: "rodinny", label: "Rodinný pobyt", description: "Pobyt vhodný pre celú rodinu" },
  { id: "komorka", label: "Pobyt v komôrke", description: "Exkluzívny a pokojný pobyt" }
];

const BookingForm = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedStay, setSelectedStay] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { stays } = useThematicStaysDatabase();

  // Convert thematic stays to booking options
  const stayOptions = stays.length > 0 ? stays.map(stay => ({
    id: stay.stay_id,
    label: stay.title,
    description: stay.description.length > 50 ? stay.description.substring(0, 50) + '...' : stay.description
  })) : DEFAULT_STAY_OPTIONS;

  const getStayTypeLabel = (stayId: string) => {
    const stay = stayOptions.find(option => option.id === stayId);
    return stay ? stay.label : stayId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut || !name || !email) {
      toast.error("Prosím vyplňte všetky povinné polia");
      return;
    }
    
    if (!selectedStay) {
      toast.error("Prosím vyberte typ pobytu");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        name,
        email,
        dateFrom: checkIn,
        dateTo: checkOut,
        guests: parseInt(guests),
        stayType: getStayTypeLabel(selectedStay),
        coupon: couponCode || null
      };

      console.log('Creating booking...', bookingData);

      // Save booking to database
      const { data: savedBooking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          name,
          email,
          date_from: checkIn,
          date_to: checkOut,
          guests: parseInt(guests),
          stay_type: getStayTypeLabel(selectedStay),
          coupon: couponCode || null,
          status: 'Čaká na potvrdenie'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error saving booking:', bookingError);
        throw new Error('Chyba pri ukladaní rezervácie do databázy');
      }

      console.log('Booking saved successfully:', savedBooking);

      // Get email settings from localStorage
      const emailSettings = localStorage.getItem('emailSettings');
      let emailTemplate = {
        subject: "Potvrdenie rezervácie - Apartmán Tília",
        content: `Dobrý deň {name},

ďakujeme Vám za rezerváciu v našom apartmáne Tília.

Vaša rezervácia bola úspešne prijatá s nasledovnými údajmi:
- Dátum príchodu: {dateFrom}
- Dátum odchodu: {dateTo}
- Počet hostí: {guests}
- Typ pobytu: {stayType}${couponCode ? '\n- Zľavový kupón: {coupon}' : ''}

V prípade akýchkoľvek otázok nás neváhajte kontaktovať.

Tešíme sa na Vašu návštevu!`
      };
      let senderEmail = "onboarding@resend.dev";
      let adminNotificationSettings = null;

      if (emailSettings) {
        const settings = JSON.parse(emailSettings);
        emailTemplate = settings.confirmationTemplate;
        senderEmail = settings.senderEmail || senderEmail;
        
        // Prepare admin notification settings
        if (settings.adminNotificationsEnabled && settings.adminEmail) {
          adminNotificationSettings = {
            adminEmail: settings.adminEmail,
            adminTemplate: settings.adminNotificationTemplate
          };
        }
      }

      console.log('Sending booking confirmation email...', { 
        bookingData, 
        emailTemplate, 
        senderEmail, 
        adminNotificationSettings 
      });

      // Send email confirmation
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          bookingData,
          emailTemplate,
          senderEmail,
          adminNotificationSettings
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        // Don't throw error for email failure, booking is already saved
        console.warn('Email sending failed, but booking was saved successfully');
      } else {
        console.log('Email sent successfully:', data);
      }

      toast.success("Rezervácia bola úspešne vytvorená! Potvrdenie sme Vám poslali na email.");
      
      // Reset form
      setName("");
      setEmail("");
      setCheckIn("");
      setCheckOut("");
      setGuests("2");
      setSelectedStay("");
      setCouponCode("");

    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Chyba pri vytváraní rezervácie. Skúste to prosím znovu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Nezáväzná rezervácia
        </CardTitle>
        <CardDescription>
          Vyplňte formulár a my vás budeme kontaktovať
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Meno a priezvisko *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Dátum príchodu *</Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkout">Dátum odchodu *</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests">Počet hostí</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="4"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="coupon" className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-500" />
                Zľavový kupón
              </Label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Zadajte kód kupónu"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Typ pobytu *
            </Label>
            <RadioGroup value={selectedStay} onValueChange={setSelectedStay} required>
              {stayOptions.map((option, index) => {
                const uniqueKey = `${option.id}-${index}`;
                return (
                  <div key={uniqueKey} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value={option.id} id={uniqueKey} />
                    <div className="flex-1">
                      <Label htmlFor={uniqueKey} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? "Odosielam..." : "Odoslať nezáväznú rezerváciu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
