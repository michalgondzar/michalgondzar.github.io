import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useContact } from "@/contexts/ContactContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import GoogleMap from "./GoogleMap";

const Contact = () => {
  const {
    toast
  } = useToast();
  const {
    contactData
  } = useContact();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const contactMessage = {
      name: formData.get('contactName') as string,
      email: formData.get('contactEmail') as string,
      subject: formData.get('contactSubject') as string,
      message: formData.get('contactMessage') as string
    };
    try {
      const {
        error
      } = await supabase.from('contact_messages').insert([contactMessage]);
      if (error) {
        console.error('Error saving contact message:', error);
        toast({
          title: "Chyba pri odosielaní",
          description: "Vyskytla sa chyba pri odosielaní správy. Skúste to znovu.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Správa odoslaná",
          description: "Ďakujeme za váš záujem. Budeme vás kontaktovať čo najskôr."
        });

        // Reset form
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Chyba pri odosielaní",
        description: "Vyskytla sa chyba pri odosielaní správy. Skúste to znovu.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="kontakt" className="bg-booking-gray">
      <div className="section-container">
        <h2 className="section-title">Kontakt</h2>
        <p className="section-subtitle">Kontaktujte nás s akýmikoľvek otázkami</p>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Kontaktné informácie</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-booking-primary mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Adresa</h4>
                    <address className="not-italic text-gray-600">
                      {contactData.address}<br />
                      {contactData.postalCode}<br />
                      Slovensko
                    </address>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-booking-primary mr-3" />
                  <div>
                    <h4 className="font-medium">Telefón</h4>
                    <a href={`tel:${contactData.phone}`} className="text-gray-600 hover:text-booking-primary transition-colors">
                      {contactData.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-booking-primary mr-3" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href={`mailto:${contactData.email}`} className="text-gray-600 hover:text-booking-primary transition-colors">
                      {contactData.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-booking-primary mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Check-in / Check-out</h4>
                    <p className="text-gray-600">
                      Príchod: {contactData.checkinTime}<br />
                      Odchod: {contactData.checkoutTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Ako sa k nám dostanete</h3>
              <p className="text-gray-600 mb-4">Apartmán sa nachádza len 10 minút pešo od aquaparku Bešeňová. Z diaľnice D1 použite zjazd Ružomberok a pokračujte smerom na Liptovský Mikuláš po ceste I/18.</p>
              <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                <GoogleMap className="rounded-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Napíšte nám</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Meno a priezvisko</Label>
                  <Input id="contactName" name="contactName" placeholder="Vaše meno" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" placeholder="Váš email" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactSubject">Predmet</Label>
                <Input id="contactSubject" name="contactSubject" placeholder="Predmet správy" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactMessage">Správa</Label>
                <textarea id="contactMessage" name="contactMessage" className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Vaša správa..." required></textarea>
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full bg-booking-primary hover:bg-booking-secondary">
                {isSubmitting ? "Odosielam..." : "Odoslať správu"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
