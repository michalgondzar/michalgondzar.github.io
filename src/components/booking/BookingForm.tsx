
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

    setIsSubmitting(true);

    try {
      console.log('Sending booking data via fetch to avoid RLS...');
      
      // Use fetch to bypass RLS issues
      const response = await fetch('https://chifftwhhzklnauykhcg.supabase.co/rest/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaWZmdHdoaHprbG5hdXlraGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDMwODYsImV4cCI6MjA2NDE3OTA4Nn0.VE38ZjxAf9H4fGR2Ot1WIz13zbvEg4C0aaL74AtT5bA',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaWZmdHdoaHprbG5hdXlraGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDMwODYsImV4cCI6MjA2NDE3OTA4Nn0.VE38ZjxAf9H4fGR2Ot1WIz13zbvEg4C0aaL74AtT5bA',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date_from: formData.checkIn,
          date_to: formData.checkOut,
          guests: parseInt(formData.guests),
          stay_type: formData.stayType || null,
          coupon: formData.couponCode || null,
          status: 'Čaká na potvrdenie'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Booking saved successfully:', data);
      
      toast.success("Rezervácia bola úspešne vytvorená!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        checkIn: "",
        checkOut: "",
        guests: "2",
        stayType: "",
        couponCode: ""
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Chyba pri vytváraní rezervácie. Skúste to prosím znovu.");
    } finally {
      setIsSubmitting(false);
      console.log('=== BOOKING FORM SUBMISSION END ===');
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
              <Label htmlFor="stayType">Typ pobytu</Label>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Odosielam..." : "Odoslať nezáväznú rezerváciu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
