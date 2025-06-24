import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon, Edit, Trash, Plus, Heart, Tag, Euro } from "lucide-react";
import { BookingForm } from "./BookingForm";
import { GoogleCalendarDialog } from "./GoogleCalendarDialog";
import { supabase } from "@/integrations/supabase/client";
import { usePriceCalculator } from "@/components/booking/hooks/usePriceCalculator";

interface Booking {
  id: string;
  name: string;
  email: string;
  date_from: string;
  date_to: string;
  guests: number;
  status: string;
  stay_type?: string;
  coupon?: string;
  created_at: string;
  updated_at: string;
}

export const BookingsManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGoogleCalendarDialogOpen, setIsGoogleCalendarDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const { calculatePrice } = usePriceCalculator();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      dateFrom: "",
      dateTo: "",
      guests: 2,
      status: "Čaká na potvrdenie",
      stayType: "",
      coupon: ""
    }
  });

  // Load bookings from database
  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error);
        toast.error('Chyba pri načítavaní rezervácií');
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Chyba pri načítavaní rezervácií');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Function to update availability calendar when booking status changes
  const updateAvailabilityCalendar = async (booking: Booking, isConfirmed: boolean) => {
    try {
      const startDate = new Date(booking.date_from);
      const endDate = new Date(booking.date_to);
      
      // Generate all dates between start and end
      const dates = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Update availability for each date
      for (const date of dates) {
        await supabase
          .from('availability_calendar')
          .upsert({
            date: date,
            is_available: !isConfirmed // If confirmed, mark as unavailable
          }, {
            onConflict: 'date'
          });
      }

      console.log(`Updated availability calendar for booking ${booking.id}, confirmed: ${isConfirmed}`);
    } catch (error) {
      console.error('Error updating availability calendar:', error);
    }
  };

  const getStayTypeLabel = (stayType?: string) => {
    const stayTypes = {
      "manzelsky": "Manželský pobyt",
      "rodinny": "Rodinný pobyt", 
      "komôrka": "Pobyt v komôrke"
    };
    return stayType ? stayTypes[stayType as keyof typeof stayTypes] || stayType : "Neuvedené";
  };

  const calculateBookingPrice = (booking: Booking) => {
    const calculation = calculatePrice(booking.date_from, booking.date_to, booking.guests);
    return calculation ? calculation.totalPrice.toFixed(2) : "-";
  };

  const openAddDialog = () => {
    form.reset({
      name: "",
      email: "",
      dateFrom: "",
      dateTo: "",
      guests: 2,
      status: "Čaká na potvrdenie",
      stayType: "",
      coupon: ""
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (booking: Booking) => {
    setCurrentBooking(booking);
    form.reset({
      name: booking.name,
      email: booking.email,
      dateFrom: booking.date_from,
      dateTo: booking.date_to,
      guests: booking.guests,
      status: booking.status,
      stayType: booking.stay_type || "",
      coupon: booking.coupon || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleAddBooking = async (data: any) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          name: data.name,
          email: data.email,
          date_from: data.dateFrom,
          date_to: data.dateTo,
          guests: data.guests,
          stay_type: data.stayType,
          coupon: data.coupon || null,
          status: data.status
        });

      if (error) {
        console.error('Error adding booking:', error);
        toast.error('Chyba pri pridávaní rezervácie');
        return;
      }

      // Update availability calendar if booking is confirmed
      if (data.status === "Potvrdené") {
        await updateAvailabilityCalendar({
          id: '',
          name: data.name,
          email: data.email,
          date_from: data.dateFrom,
          date_to: data.dateTo,
          guests: data.guests,
          status: data.status,
          stay_type: data.stayType,
          coupon: data.coupon,
          created_at: '',
          updated_at: ''
        }, true);
      }

      toast.success("Rezervácia bola pridaná");
      setIsAddDialogOpen(false);
      loadBookings(); // Reload bookings
    } catch (error) {
      console.error('Error adding booking:', error);
      toast.error('Chyba pri pridávaní rezervácie');
    }
  };

  const handleEditBooking = async (data: any) => {
    if (!currentBooking) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          name: data.name,
          email: data.email,
          date_from: data.dateFrom,
          date_to: data.dateTo,
          guests: data.guests,
          stay_type: data.stayType,
          coupon: data.coupon || null,
          status: data.status
        })
        .eq('id', currentBooking.id);

      if (error) {
        console.error('Error updating booking:', error);
        toast.error('Chyba pri úprave rezervácie');
        return;
      }

      // Update availability calendar based on status change
      const wasConfirmed = currentBooking.status === "Potvrdené";
      const isNowConfirmed = data.status === "Potvrdené";
      
      if (wasConfirmed !== isNowConfirmed) {
        await updateAvailabilityCalendar(currentBooking, isNowConfirmed);
      }

      toast.success("Rezervácia bola upravená");
      setIsEditDialogOpen(false);
      loadBookings(); // Reload bookings
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Chyba pri úprave rezervácie');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Naozaj chcete odstrániť túto rezerváciu?")) {
      return;
    }

    try {
      // Get booking details before deleting to update availability
      const bookingToDelete = bookings.find(b => b.id === id);
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting booking:', error);
        toast.error('Chyba pri odstraňovaní rezervácie');
        return;
      }

      // If booking was confirmed, free up the dates in availability calendar
      if (bookingToDelete && bookingToDelete.status === "Potvrdené") {
        await updateAvailabilityCalendar(bookingToDelete, false);
      }

      toast.success("Rezervácia bola odstránená");
      loadBookings(); // Reload bookings
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Chyba pri odstraňovaní rezervácie');
    }
  };

  const connectGoogleCalendar = () => {
    toast.success("Pripojené k Google Kalendáru", {
      description: "Teraz môžete synchronizovať rezervácie"
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Načítavam rezervácie...</div>;
  }

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
              onClick={() => setIsGoogleCalendarDialogOpen(true)}
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
                <TableHead>Typ pobytu</TableHead>
                <TableHead>Kupón</TableHead>
                <TableHead>Predbežná cena</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead className="text-right">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.date_from}</TableCell>
                  <TableCell>{booking.date_to}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="text-pink-500" />
                      <span className="text-sm">{getStayTypeLabel(booking.stay_type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.coupon ? (
                      <div className="flex items-center gap-1">
                        <Tag size={14} className="text-green-500" />
                        <span className="text-sm font-mono bg-green-50 px-2 py-1 rounded">{booking.coupon}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Euro size={14} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        {calculateBookingPrice(booking)}€
                      </span>
                    </div>
                  </TableCell>
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
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                    Žiadne rezervácie
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

      {/* Google Calendar Dialog */}
      <GoogleCalendarDialog 
        isOpen={isGoogleCalendarDialogOpen}
        onClose={() => setIsGoogleCalendarDialogOpen(false)}
        bookings={bookings}
      />
    </>
  );
};
