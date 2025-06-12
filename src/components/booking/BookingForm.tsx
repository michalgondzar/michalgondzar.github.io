
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useThematicStaysDatabase } from "@/hooks/useThematicStaysDatabase";
import { BookingFormFields } from "./components/BookingFormFields";
import { StayTypeSelector } from "./components/StayTypeSelector";
import { useBookingSubmission } from "./hooks/useBookingSubmission";
import { validateBookingForm } from "./utils/bookingValidation";
import { toast } from "sonner";

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
  
  const { stays } = useThematicStaysDatabase();
  const { submitBooking, isSubmitting } = useBookingSubmission();

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
    
    const validationError = validateBookingForm(checkIn, checkOut, name, email, selectedStay);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const bookingData = {
      name,
      email,
      dateFrom: checkIn,
      dateTo: checkOut,
      guests: parseInt(guests),
      stayType: getStayTypeLabel(selectedStay),
      coupon: couponCode || null
    };

    const success = await submitBooking(bookingData);
    
    if (success) {
      // Reset form
      setName("");
      setEmail("");
      setCheckIn("");
      setCheckOut("");
      setGuests("2");
      setSelectedStay("");
      setCouponCode("");
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
          <BookingFormFields
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
          />
          
          <StayTypeSelector
            selectedStay={selectedStay}
            setSelectedStay={setSelectedStay}
            stayOptions={stayOptions}
          />
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? "Odosielam..." : "Odoslať nezáväznú rezerváciu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
