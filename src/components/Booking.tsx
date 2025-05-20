
import { useState } from 'react';
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Simulácia obsadenosti apartmánu
const bookedDates = [
  { start: new Date(2025, 5, 10), end: new Date(2025, 5, 15) },
  { start: new Date(2025, 5, 20), end: new Date(2025, 5, 25) },
  { start: new Date(2025, 6, 5), end: new Date(2025, 6, 10) },
];

const Booking = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [message, setMessage] = useState("");
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Rezervácia odoslaná",
      description: "Ďakujeme za váš záujem. Budeme vás kontaktovať čo najskôr.",
    });
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setGuests("2");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setMessage("");
  };
  
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (booking) => date >= booking.start && date <= booking.end
    );
  };

  return (
    <section id="rezervacia" className="section-container">
      <h2 className="section-title">Rezervácia</h2>
      <p className="section-subtitle">Vyberte si termín a rezervujte si pobyt v našom apartmáne</p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Dostupnosť</CardTitle>
            <CardDescription>Skontrolujte si voľné termíny</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-booking-gray mr-2 border border-gray-300"></div>
                    <span className="text-sm">Dostupné</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-booking-primary/30 mr-2 border border-booking-primary"></div>
                    <span className="text-sm">Obsadené</span>
                  </div>
                </div>
                <Calendar
                  mode="range"
                  selected={{
                    from: checkIn,
                    to: checkOut,
                  }}
                  onSelect={(range) => {
                    setCheckIn(range?.from);
                    setCheckOut(range?.to);
                  }}
                  className="mx-auto rounded-md border pointer-events-auto"
                  disabled={(date) => 
                    date < new Date() || isDateBooked(date)
                  }
                  modifiers={{
                    booked: (date) => isDateBooked(date),
                  }}
                  modifiersClassNames={{
                    booked: "bg-booking-primary/30 text-primary-foreground opacity-70",
                  }}
                />
              </div>
              
              <div className="bg-booking-gray p-4 rounded-lg">
                <h3 className="font-medium mb-2">Cenník</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Základná cena (1-2 osoby):</span>
                    <span className="font-semibold">75 € / noc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dodatočná osoba:</span>
                    <span className="font-semibold">15 € / noc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Víkendový príplatok (Pi-Ne):</span>
                    <span className="font-semibold">10 € / noc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimálna dĺžka pobytu:</span>
                    <span className="font-semibold">2 noci</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rezervačný formulár</CardTitle>
            <CardDescription>Vyplňte všetky údaje pre dokončenie rezervácie</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Meno</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Zadajte meno"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Priezvisko</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Zadajte priezvisko"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="vas@email.sk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefón</Label>
                  <Input 
                    id="phone" 
                    placeholder="+421 XXX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="guests">Počet hostí</Label>
                  <select 
                    id="guests"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    required
                  >
                    <option value="1">1 osoba</option>
                    <option value="2">2 osoby</option>
                    <option value="3">3 osoby</option>
                    <option value="4">4 osoby</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Termín pobytu</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? (
                            format(checkIn, "P", { locale: sk })
                          ) : (
                            <span>Príchod</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => 
                            date < new Date() || isDateBooked(date)
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? (
                            format(checkOut, "P", { locale: sk })
                          ) : (
                            <span>Odchod</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => 
                            (checkIn ? date <= checkIn : date <= new Date()) || isDateBooked(date)
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Správa (voliteľné)</Label>
                <textarea 
                  id="message" 
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Vaše ďalšie požiadavky alebo otázky..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-booking-primary hover:bg-booking-secondary"
              >
                Odoslať rezerváciu
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Booking;
