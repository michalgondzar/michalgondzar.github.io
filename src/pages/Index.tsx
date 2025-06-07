
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Description from "@/components/Description";
import ThematicStays from "@/components/ThematicStays";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
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
        <Description />
        <ThematicStays />
        <Gallery />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
