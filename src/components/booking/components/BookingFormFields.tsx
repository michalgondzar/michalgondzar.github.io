
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";

interface BookingFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  guests: string;
  setGuests: (value: string) => void;
  couponCode: string;
  setCouponCode: (value: string) => void;
}

export const BookingFormFields = ({
  name,
  setName,
  email,
  setEmail,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  couponCode,
  setCouponCode,
}: BookingFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};
