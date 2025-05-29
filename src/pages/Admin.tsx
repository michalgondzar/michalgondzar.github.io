
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { FileText, CalendarIcon, Image, MapPin, Heart } from "lucide-react";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/admin/AuthForm";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { MaritalStaysEditor } from "@/components/admin/MaritalStaysEditor";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (username: string, password: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.info("Odhlásenie úspešné");
    navigate("/");
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Panel - Apartmán Tília</h1>
            <p className="text-gray-600">Správa obsahu, galérie, kontaktov a rezervácií apartmánu</p>
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
            <TabsTrigger value="marital-stays" className="flex items-center gap-2">
              <Heart size={16} />
              Manželské pobyty
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MapPin size={16} />
              Kontakt
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              Rezervácie
            </TabsTrigger>
          </TabsList>
          
          {/* Obsah stránky */}
          <TabsContent value="content" className="space-y-6">
            <ContentEditor />
          </TabsContent>
          
          {/* Galéria */}
          <TabsContent value="gallery" className="space-y-6">
            <GalleryManager />
          </TabsContent>
          
          {/* Manželské pobyty */}
          <TabsContent value="marital-stays" className="space-y-6">
            <MaritalStaysEditor />
          </TabsContent>
          
          {/* Kontakt */}
          <TabsContent value="contact" className="space-y-6">
            <ContactEditor />
          </TabsContent>
          
          {/* Rezervácie */}
          <TabsContent value="bookings">
            <BookingsManager />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
