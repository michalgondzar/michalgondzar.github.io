
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Description from "@/components/Description";
import Gallery from "@/components/Gallery";
import MaritalStays from "@/components/MaritalStays";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Description />
        <Gallery />
        <MaritalStays />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
