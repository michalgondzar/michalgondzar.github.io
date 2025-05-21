
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon, Edit, Trash, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { BookingForm } from "./BookingForm";

interface Booking {
  id: number;
  name: string;
  email: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  status: string;
}

export const BookingsManager = () => {
  // Dáta pre kalendár rezervácií
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 1, name: "Ján Novák", email: "jan@example.com", dateFrom: "2025-06-01", dateTo: "2025-06-05", guests: 2, status: "Potvrdené" },
    { id: 2, name: "Anna Kováčová", email: "anna@example.com", dateFrom: "2025-06-10", dateTo: "2025-06-15", guests: 3, status: "Čaká na potvrdenie" },
    { id: 3, name: "Peter Malý", email: "peter@example.com", dateFrom: "2025-06-20", dateTo: "2025-06-22", guests: 2, status: "Potvrdené" }
  ]);

  // Správa dialógov
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  
  // Kalendár - dátum a vybrané dátumy
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Form pre bookings
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      dateFrom: "",
      dateTo: "",
      guests: 2,
      status: "Čaká na potvrdenie"
    }
  });

  const openAddDialog = () => {
    form.reset({
      name: "",
      email: "",
      dateFrom: "",
      dateTo: "",
      guests: 2,
      status: "Čaká na potvrdenie"
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (booking: Booking) => {
    setCurrentBooking(booking);
    form.reset({
      name: booking.name,
      email: booking.email,
      dateFrom: booking.dateFrom,
      dateTo: booking.dateTo,
      guests: booking.guests,
      status: booking.status
    });
    setIsEditDialogOpen(true);
  };

  const handleAddBooking = (data: any) => {
    const newBooking = {
      id: bookings.length + 1,
      ...data
    };
    setBookings([...bookings, newBooking]);
    setIsAddDialogOpen(false);
    toast.success("Rezervácia bola pridaná");
  };

  const handleEditBooking = (data: any) => {
    if (!currentBooking) return;
    
    const updatedBookings = bookings.map(booking => 
      booking.id === currentBooking.id ? { ...booking, ...data } : booking
    );
    setBookings(updatedBookings);
    setIsEditDialogOpen(false);
    toast.success("Rezervácia bola upravená");
  };

  const handleDeleteBooking = (id: number) => {
    if (confirm("Naozaj chcete odstrániť túto rezerváciu?")) {
      const updatedBookings = bookings.filter(booking => booking.id !== id);
      setBookings(updatedBookings);
      toast.success("Rezervácia bola odstránená");
    }
  };

  // Integrácia s Google kalendárom - tu by bola skutočná implementácia
  const connectGoogleCalendar = () => {
    // V skutočnej aplikácii by sme tu implementovali OAuth 2.0 autorizačný flow pre Google Calendar API
    toast.success("Pripojené k Google Kalendáru", {
      description: "Teraz môžete synchronizovať rezervácie"
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-booking-primary" />
            <h2 className="text-xl font-semibold">Rezervácie</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={connectGoogleCalendar}
              className="flex items-center gap-2"
            >
              Prepojiť s Google Kalendárom
            </Button>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus size={16} />
              Pridať rezerváciu
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meno</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Od</TableHead>
                <TableHead>Do</TableHead>
                <TableHead>Hostia</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.dateFrom}</TableCell>
                  <TableCell>{booking.dateTo}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === "Potvrdené" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(booking)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="text-booking-primary" />
          <h2 className="text-xl font-semibold">Kalendár obsadenosti</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="pointer-events-auto">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              className="rounded border"
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Kliknite na dátumy v kalendári pre označenie obsadených dní
          </div>
          <Button 
            onClick={() => toast.success("Obsadenosť aktualizovaná")}
            className="mt-4"
          >
            Uložiť obsadenosť
          </Button>
        </div>
      </div>

      {/* Dialóg pre pridávanie rezervácie */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pridať novú rezerváciu</DialogTitle>
          </DialogHeader>
          <BookingForm 
            form={form} 
            onSubmit={handleAddBooking} 
            onCancel={() => setIsAddDialogOpen(false)}
            submitLabel="Pridať rezerváciu"
          />
        </DialogContent>
      </Dialog>

      {/* Dialóg pre úpravu rezervácie */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upraviť rezerváciu</DialogTitle>
          </DialogHeader>
          <BookingForm 
            form={form} 
            onSubmit={handleEditBooking}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Uložiť zmeny"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
