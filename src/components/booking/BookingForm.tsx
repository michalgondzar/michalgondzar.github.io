import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useBookingSubmission } from "./hooks/useBookingSubmission";
import { useAvailabilityCheck } from "./hooks/useAvailabilityCheck";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    stayType: "",
    couponCode: ""
  });

  const { submitBooking, isSubmitting } = useBookingSubmission();
  const { validateAndShowMessage, loading: availabilityLoading, errorMessage } = useAvailabilityCheck();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Kontrola dostupnosti pri zmene dátumov
    if (field === 'checkIn' || field === 'checkOut') {
      const newFormData = { ...formData, [field]: value };
      
      // Malé oneskorenie aby sa zabránilo príliš častým kontrolám
      setTimeout(() => {
        if (newFormData.checkIn && newFormData.checkOut) {
          validateAndShowMessage(newFormData.checkIn, newFormData.checkOut);
        }
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== BOOKING FORM SUBMISSION START ===');
    console.log('Form data:', formData);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.checkIn || !formData.checkOut) {
      toast.error("Prosím vyplňte všetky povinné polia");
      return;
    }

    // Kontrola dostupnosti pred odoslaním
    const isAvailable = validateAndShowMessage(formData.checkIn, formData.checkOut);
    if (!isAvailable) {
      return; // Zabránenie odoslaniu ak termín nie je dostupný
    }

    // Use the booking submission hook which handles both database saving and email sending
    const success = await submitBooking({
      name: formData.name,
      email: formData.email,
      dateFrom: formData.checkIn,
      dateTo: formData.checkOut,
      guests: parseInt(formData.guests),
      stayType: formData.stayType || null,
      coupon: formData.couponCode || null,
    });

    if (success) {
      // Reset form on successful submission
      setFormData({
        name: "",
        email: "",
        checkIn: "",
        checkOut: "",
        guests: "2",
        stayType: "",
        couponCode: ""
      });
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
        {errorMessage && (
          <Alert variant="destructive" className="mb-4 border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-semibold text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Meno a priezvisko *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Vaše meno"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="vas@email.sk"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Dátum príchodu *</Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                required
                disabled={availabilityLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Dátum odchodu *</Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                required
                disabled={availabilityLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests">Počet hostí</Label>
              <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 osoba</SelectItem>
                  <SelectItem value="2">2 osoby</SelectItem>
                  <SelectItem value="3">3 osoby</SelectItem>
                  <SelectItem value="4">4 osoby</SelectItem>
                  <SelectItem value="5">5 osôb</SelectItem>
                  <SelectItem value="6">6 osôb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stayType">Typ pobytu (nepovinné)</Label>
              <Select value={formData.stayType} onValueChange={(value) => handleInputChange('stayType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ pobytu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manzelsky">Manželský pobyt</SelectItem>
                  <SelectItem value="rodinny">Rodinný pobyt</SelectItem>
                  <SelectItem value="komorka">Pobyt v komôrke</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon">Zľavový kupón</Label>
            <Input
              id="coupon"
              type="text"
              value={formData.couponCode}
              onChange={(e) => handleInputChange('couponCode', e.target.value)}
              placeholder="Zadajte kód kupónu (voliteľné)"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={isSubmitting || availabilityLoading}
          >
            {isSubmitting ? "Odosielam..." : "Odoslať nezáväznú rezerváciu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
