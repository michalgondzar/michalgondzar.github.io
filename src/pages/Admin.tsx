
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Calendar, Image, MessageSquare, Settings, Heart, BarChart3, Euro, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthForm } from "@/components/admin/AuthForm";
import { BookingsManager } from "@/components/admin/BookingsManager";
import AvailabilityManager from "@/components/admin/AvailabilityManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ContactMessagesManager } from "@/components/admin/ContactMessagesManager";
import { ContentEditor } from "@/components/admin/ContentEditor";
import ThematicStaysManager from "@/components/admin/ThematicStaysManager";
import { VisitStatistics } from "@/components/admin/VisitStatistics";
import { PricingEditor } from "@/components/admin/PricingEditor";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminToken") ? true : false
  );

  const handleLogin = (token: string) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <div className="container mx-auto py-10">
      {!isAuthenticated ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Admin Panel</h1>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Prejsť na hlavnú stránku
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Odhlásiť sa
              </Button>
            </div>
          </div>

          <Tabs defaultValue="bookings" className="w-[100%]">
            <TabsList>
              <TabsTrigger value="bookings">
                <Users className="mr-2 h-4 w-4" />
                Rezervácie
              </TabsTrigger>
              <TabsTrigger value="availability">
                <Calendar className="mr-2 h-4 w-4" />
                Dostupnosť
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <Euro className="mr-2 h-4 w-4" />
                Cenník
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <Image className="mr-2 h-4 w-4" />
                Galéria
              </TabsTrigger>
              <TabsTrigger value="contact">
                <MessageSquare className="mr-2 h-4 w-4" />
                Správy
              </TabsTrigger>
              <TabsTrigger value="content">
                <Settings className="mr-2 h-4 w-4" />
                Obsah
              </TabsTrigger>
              <TabsTrigger value="thematic">
                <Heart className="mr-2 h-4 w-4" />
                Tematické pobyty
              </TabsTrigger>
              <TabsTrigger value="statistics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Štatistiky
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bookings" className="mt-6">
              <BookingsManager />
            </TabsContent>
            <TabsContent value="availability" className="mt-6">
              <AvailabilityManager />
            </TabsContent>
            <TabsContent value="pricing" className="mt-6">
              <PricingEditor />
            </TabsContent>
            <TabsContent value="gallery" className="mt-6">
              <GalleryManager />
            </TabsContent>
            <TabsContent value="contact" className="mt-6">
              <ContactMessagesManager />
            </TabsContent>
            <TabsContent value="content" className="mt-6">
              <ContentEditor />
            </TabsContent>
            <TabsContent value="thematic" className="mt-6">
              <ThematicStaysManager />
            </TabsContent>
             <TabsContent value="statistics" className="mt-6">
              <VisitStatistics />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Admin;
