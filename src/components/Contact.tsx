
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Správa odoslaná",
      description: "Ďakujeme za váš záujem. Budeme vás kontaktovať čo najskôr.",
    });
    // Reset form would happen here
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
                      Apartmán Tri víly<br />
                      Bešeňová 123<br />
                      034 83 Bešeňová<br />
                      Slovensko
                    </address>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-booking-primary mr-3" />
                  <div>
                    <h4 className="font-medium">Telefón</h4>
                    <a href="tel:+421900123456" className="text-gray-600 hover:text-booking-primary transition-colors">
                      +421 900 123 456
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-booking-primary mr-3" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href="mailto:info@trivily.sk" className="text-gray-600 hover:text-booking-primary transition-colors">
                      info@trivily.sk
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-booking-primary mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Check-in / Check-out</h4>
                    <p className="text-gray-600">
                      Príchod: 14:00 - 20:00<br />
                      Odchod: do 10:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Ako sa k nám dostanete</h3>
              <p className="text-gray-600 mb-4">
                Apartmán sa nachádza len 15 minút pešo od aquaparku Bešeňová. Z diaľnice D1 
                použite zjazd Ružomberok a pokračujte smerom na Liptovský Mikuláš po ceste I/18.
              </p>
              <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10463.988141273428!2d19.413608041796878!3d49.10291900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4715a10e6231665b%3A0xbbe748383852d04f!2zQmXFoWXFiG92w6E!5e0!3m2!1ssk!2ssk!4v1716389790057!5m2!1ssk!2ssk" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Napíšte nám</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Meno a priezvisko</Label>
                  <Input id="contactName" placeholder="Vaše meno" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" type="email" placeholder="Váš email" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactSubject">Predmet</Label>
                <Input id="contactSubject" placeholder="Predmet správy" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactMessage">Správa</Label>
                <textarea 
                  id="contactMessage" 
                  className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Vaša správa..."
                  required
                ></textarea>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-booking-primary hover:bg-booking-secondary"
              >
                Odoslať správu
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
