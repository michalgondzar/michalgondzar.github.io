
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Description from "@/components/Description";
import Gallery from "@/components/Gallery";
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
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
