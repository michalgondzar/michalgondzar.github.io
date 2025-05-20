
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { CalendarIcon, UsersIcon, Edit, Trash, Plus } from "lucide-react";
import Footer from "@/components/Footer";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([
    { id: 1, name: "Ján Novák", email: "jan@example.com", dateFrom: "2025-06-01", dateTo: "2025-06-05", guests: 2, status: "Potvrdené" },
    { id: 2, name: "Anna Kováčová", email: "anna@example.com", dateFrom: "2025-06-10", dateTo: "2025-06-15", guests: 3, status: "Čaká na potvrdenie" },
    { id: 3, name: "Peter Malý", email: "peter@example.com", dateFrom: "2025-06-20", dateTo: "2025-06-22", guests: 2, status: "Potvrdené" }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

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

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple authentication - in a real app, use proper authentication
    if (username === "admin" && password === "trivily2025") {
      setIsAuthenticated(true);
      toast.success("Prihlásenie úspešné");
    } else {
      toast.error("Nesprávne prihlasovacie údaje");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    toast.info("Odhlásenie úspešné");
  };

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

  const openEditDialog = (booking) => {
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

  const handleAddBooking = (data) => {
    const newBooking = {
      id: bookings.length + 1,
      ...data
    };
    setBookings([...bookings, newBooking]);
    setIsAddDialogOpen(false);
    toast.success("Rezervácia bola pridaná");
  };

  const handleEditBooking = (data) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === currentBooking.id ? { ...booking, ...data } : booking
    );
    setBookings(updatedBookings);
    setIsEditDialogOpen(false);
    toast.success("Rezervácia bola upravená");
  };

  const handleDeleteBooking = (id) => {
    if (confirm("Naozaj chcete odstrániť túto rezerváciu?")) {
      const updatedBookings = bookings.filter(booking => booking.id !== id);
      setBookings(updatedBookings);
      toast.success("Rezervácia bola odstránená");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center h-20 bg-booking-primary px-6">
          <Logo white />
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Admin prihlásenie</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Používateľské meno</label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Heslo</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">Prihlásiť sa</Button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-booking-primary text-white py-4 px-6 flex items-center justify-between">
        <Logo white />
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base">Prihlásený ako Admin</span>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={handleLogout}>
            Odhlásiť
          </Button>
        </div>
      </div>
      
      <div className="flex-1 container mx-auto p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Panel - Tri víly</h1>
            <p className="text-gray-600">Správa rezervácií a obsadenosti apartmánu</p>
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2 bg-booking-primary hover:bg-booking-secondary">
            <Plus size={16} />
            Pridať rezerváciu
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="text-booking-primary" />
            <h2 className="text-xl font-semibold">Rezervácie</h2>
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
            <UsersIcon className="text-booking-primary" />
            <h2 className="text-xl font-semibold">Štatistiky</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-lg font-medium text-gray-500">Celkovo rezervácií</div>
              <div className="text-3xl font-bold text-booking-primary mt-1">{bookings.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-lg font-medium text-gray-500">Potvrdené rezervácie</div>
              <div className="text-3xl font-bold text-booking-primary mt-1">
                {bookings.filter(b => b.status === "Potvrdené").length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-lg font-medium text-gray-500">Čakajúce rezervácie</div>
              <div className="text-3xl font-bold text-booking-primary mt-1">
                {bookings.filter(b => b.status === "Čaká na potvrdenie").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pridať novú rezerváciu</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddBooking)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meno a priezvisko</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dátum príchodu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dátum odchodu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Počet hostí</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stav</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Čaká na potvrdenie">Čaká na potvrdenie</option>
                          <option value="Potvrdené">Potvrdené</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Zrušiť
                </Button>
                <Button type="submit" className="bg-booking-primary hover:bg-booking-secondary">
                  Pridať rezerváciu
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upraviť rezerváciu</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditBooking)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meno a priezvisko</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dátum príchodu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dátum odchodu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Počet hostí</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stav</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Čaká na potvrdenie">Čaká na potvrdenie</option>
                          <option value="Potvrdené">Potvrdené</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Zrušiť
                </Button>
                <Button type="submit" className="bg-booking-primary hover:bg-booking-secondary">
                  Uložiť zmeny
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
