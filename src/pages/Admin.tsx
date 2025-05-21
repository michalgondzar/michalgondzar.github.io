
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, UsersIcon, Edit, Trash, Plus, FileText, Image, Save } from "lucide-react";
import Footer from "@/components/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { apartmentDescription } from "@/components/Description";
import { Calendar } from "@/components/ui/calendar";

// Typ pre obrázok
interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Dáta pre kalendár rezervácií
  const [bookings, setBookings] = useState([
    { id: 1, name: "Ján Novák", email: "jan@example.com", dateFrom: "2025-06-01", dateTo: "2025-06-05", guests: 2, status: "Potvrdené" },
    { id: 2, name: "Anna Kováčová", email: "anna@example.com", dateFrom: "2025-06-10", dateTo: "2025-06-15", guests: 3, status: "Čaká na potvrdenie" },
    { id: 3, name: "Peter Malý", email: "peter@example.com", dateFrom: "2025-06-20", dateTo: "2025-06-22", guests: 2, status: "Potvrdené" }
  ]);
  
  // Správa dialógov
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  
  // Stav pre správu obsahu
  const [content, setContent] = useState({...apartmentDescription});
  const [feature, setFeature] = useState("");
  
  // Stav pre galériu
  const [gallery, setGallery] = useState<ImageItem[]>([
    { id: 1, src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", alt: "Apartmán obývačka" },
    { id: 2, src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a", alt: "Apartmán kuchyňa" },
    { id: 3, src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd", alt: "Apartmán spálňa" },
    { id: 4, src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", alt: "Apartmán kúpeľňa" },
    { id: 5, src: "https://images.unsplash.com/photo-1610123598195-a6e2652d22fc", alt: "Apartmán terasa" }
  ]);
  const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
  
  // Kalendár - dátum a vybrané dátumy
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  // Referencia pre upload súborov
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Funkcie pre správu obsahu
  const saveContentChanges = () => {
    // V reálnej aplikácii by tu bol API volanie na uloženie do databázy
    toast.success("Zmeny obsahu boli úspešne uložené");
  };
  
  const addFeature = () => {
    if (feature.trim() !== "") {
      setContent({
        ...content,
        features: [...content.features, feature.trim()]
      });
      setFeature("");
      toast.success("Funkcia bola pridaná");
    }
  };
  
  const removeFeature = (index) => {
    const updatedFeatures = [...content.features];
    updatedFeatures.splice(index, 1);
    setContent({...content, features: updatedFeatures});
    toast.success("Funkcia bola odstránená");
  };
  
  // Funkcie pre správu galérie
  const openImageDialog = (image = null) => {
    setCurrentImage(image);
    setIsImageDialogOpen(true);
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // V reálnej aplikácii by sa tu nahrával súbor na server
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: gallery.length + 1,
          src: event.target.result as string,
          alt: file.name.replace(/\.[^/.]+$/, "") // Použitie názvu súboru ako alt
        };
        
        if (currentImage) {
          // Úprava existujúceho obrázka
          const updatedGallery = gallery.map(img => 
            img.id === currentImage.id ? {...img, src: newImage.src} : img
          );
          setGallery(updatedGallery);
          toast.success("Obrázok bol aktualizovaný");
        } else {
          // Pridanie nového obrázka
          setGallery([...gallery, newImage]);
          toast.success("Obrázok bol pridaný");
        }
        setIsImageDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const deleteImage = (id) => {
    if (confirm("Naozaj chcete odstrániť tento obrázok?")) {
      const updatedGallery = gallery.filter(img => img.id !== id);
      setGallery(updatedGallery);
      toast.success("Obrázok bol odstránený");
    }
  };

  // Integrácia s Google kalendárom - tu by bola skutočná implementácia
  const connectGoogleCalendar = () => {
    // V skutočnej aplikácii by sme tu implementovali OAuth 2.0 autorizačný flow pre Google Calendar API
    toast.success("Pripojené k Google Kalendáru", {
      description: "Teraz môžete synchronizovať rezervácie"
    });
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
            <p className="text-gray-600">Správa obsahu, galérie a rezervácií apartmánu</p>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-1">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText size={16} />
              Obsah stránky
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image size={16} />
              Galéria
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              Rezervácie
            </TabsTrigger>
          </TabsList>
          
          {/* Obsah stránky */}
          <TabsContent value="content" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Upraviť obsah stránky</h2>
              
              <div className="space-y-4">
                <div>
                  <FormLabel>Nadpis sekcie</FormLabel>
                  <Input 
                    value={content.title} 
                    onChange={(e) => setContent({...content, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <FormLabel>Podnadpis</FormLabel>
                  <Input 
                    value={content.subtitle}
                    onChange={(e) => setContent({...content, subtitle: e.target.value})}
                  />
                </div>
                
                <div>
                  <FormLabel>Prvý odstavec</FormLabel>
                  <Textarea 
                    rows={4}
                    value={content.paragraph1}
                    onChange={(e) => setContent({...content, paragraph1: e.target.value})}
                  />
                </div>
                
                <div>
                  <FormLabel>Druhý odstavec</FormLabel>
                  <Textarea 
                    rows={4}
                    value={content.paragraph2}
                    onChange={(e) => setContent({...content, paragraph2: e.target.value})}
                  />
                </div>
                
                <div>
                  <FormLabel>Funkcie apartmánu</FormLabel>
                  <div className="space-y-2">
                    {content.features.map((feat, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={feat} readOnly />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Input 
                        placeholder="Zadajte novú funkciu apartmánu..."
                        value={feature}
                        onChange={(e) => setFeature(e.target.value)}
                      />
                      <Button onClick={addFeature}>Pridať</Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={saveContentChanges}
                  className="mt-6 bg-booking-primary hover:bg-booking-secondary flex gap-2"
                >
                  <Save size={16} />
                  Uložiť zmeny obsahu
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Galéria */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Spravovať fotogalériu</h2>
                <Button 
                  onClick={() => openImageDialog()} 
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Pridať obrázok
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gallery.map((image) => (
                  <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openImageDialog(image)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white">
                      <Input 
                        value={image.alt}
                        onChange={(e) => {
                          const updatedGallery = gallery.map(img => 
                            img.id === image.id ? {...img, alt: e.target.value} : img
                          );
                          setGallery(updatedGallery);
                        }}
                        placeholder="Popis obrázka"
                        className="mt-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Rezervácie */}
          <TabsContent value="bookings">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialóg pre pridávanie rezervácie */}
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

      {/* Dialóg pre úpravu rezervácie */}
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
      
      {/* Dialóg pre nahratie/úpravu obrázka */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentImage ? "Upraviť obrázok" : "Nahrať nový obrázok"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentImage && (
              <div className="rounded-md overflow-hidden">
                <img 
                  src={currentImage.src} 
                  alt={currentImage.alt}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <FormLabel>Vyberte obrázok</FormLabel>
              <Input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                Zrušiť
              </Button>
              <Button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
              >
                {currentImage ? "Nahrať nový obrázok" : "Nahrať"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
