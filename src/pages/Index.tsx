
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import Description from "@/components/Description";
import ThematicStays from "@/components/ThematicStays";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import AvailabilitySection from "@/components/AvailabilitySection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useVisitTracker } from "@/hooks/useVisitTracker";

const Index = () => {
  // Sledovanie návštev hlavnej stránky
  useVisitTracker("/");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PromoBanner />
        <Description />
        <ThematicStays />
        <Gallery />
        <Booking />
        <AvailabilitySection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
