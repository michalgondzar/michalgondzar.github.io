
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { Save } from "lucide-react";

const initialContactData = {
  address: "Bešeňová 123",
  postalCode: "034 83 Bešeňová",
  phone: "+421 900 123 456",
  email: "info@trivily.sk",
  checkinTime: "14:00 - 20:00",
  checkoutTime: "do 10:00"
};

export const ContactEditor = () => {
  const [contact, setContact] = useState(initialContactData);

  const saveContactChanges = () => {
    // V reálnej aplikácii by tu bol API volanie na uloženie do databázy
    toast.success("Kontaktné údaje boli úspešne uložené");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upraviť kontaktné údaje</h2>
      
      <div className="space-y-4">
        <div>
          <FormLabel>Adresa</FormLabel>
          <Input 
            value={contact.address} 
            onChange={(e) => setContact({...contact, address: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>PSČ a mesto</FormLabel>
          <Input 
            value={contact.postalCode}
            onChange={(e) => setContact({...contact, postalCode: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Telefón</FormLabel>
          <Input 
            value={contact.phone}
            onChange={(e) => setContact({...contact, phone: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email"
            value={contact.email}
            onChange={(e) => setContact({...contact, email: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Čas príchodu</FormLabel>
          <Input 
            value={contact.checkinTime}
            onChange={(e) => setContact({...contact, checkinTime: e.target.value})}
          />
        </div>
        
        <div>
          <FormLabel>Čas odchodu</FormLabel>
          <Input 
            value={contact.checkoutTime}
            onChange={(e) => setContact({...contact, checkoutTime: e.target.value})}
          />
        </div>
        
        <Button 
          onClick={saveContactChanges}
          className="mt-6 bg-booking-primary hover:bg-booking-secondary flex gap-2"
        >
          <Save size={16} />
          Uložiť kontaktné údaje
        </Button>
      </div>
    </div>
  );
};
