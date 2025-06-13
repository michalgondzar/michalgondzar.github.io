
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { FileText, CalendarIcon, Image, MapPin, Euro, MessageSquare, BarChart3, Heart, Mail, Calendar } from "lucide-react";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/admin/AuthForm";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { PricingEditor } from "@/components/admin/PricingEditor";
import { ContactMessagesManager } from "@/components/admin/ContactMessagesManager";
import { VisitStatistics } from "@/components/admin/VisitStatistics";
import ThematicStaysManager from "@/components/admin/ThematicStaysManager";
import EmailSettings from "@/components/admin/EmailSettings";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
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
            <TabsTrigger value="thematic-stays" className="flex items-center gap-2">
              <Heart size={16} />
              Tematické pobyty
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image size={16} />
              Galéria
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Euro size={16} />
              Cenník
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MapPin size={16} />
              Kontakt
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail size={16} />
              Emaily
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Správy
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Štatistiky
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Calendar size={16} />
              Obsadenosť
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
          
          {/* Tematické pobyty */}
          <TabsContent value="thematic-stays" className="space-y-6">
            <ThematicStaysManager />
          </TabsContent>
          
          {/* Galéria */}
          <TabsContent value="gallery" className="space-y-6">
            <GalleryManager />
          </TabsContent>
          
          {/* Cenník */}
          <TabsContent value="pricing" className="space-y-6">
            <PricingEditor />
          </TabsContent>
          
          {/* Kontakt */}
          <TabsContent value="contact" className="space-y-6">
            <ContactEditor />
          </TabsContent>
          
          {/* Emaily */}
          <TabsContent value="email" className="space-y-6">
            <EmailSettings />
          </TabsContent>
          
          {/* Správy */}
          <TabsContent value="messages" className="space-y-6">
            <ContactMessagesManager />
          </TabsContent>
          
          {/* Štatistiky */}
          <TabsContent value="statistics" className="space-y-6">
            <VisitStatistics />
          </TabsContent>
          
          {/* Kalendár obsadenosti */}
          <TabsContent value="availability" className="space-y-6">
            <AvailabilityManager />
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
