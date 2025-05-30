
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-scroll";
import { getImageByUsage } from "@/hooks/useOtherImagesManager";

const Hero = () => {
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    const updateHeroImage = () => {
      const newImage = getImageByUsage('hero-background');
      console.log('Hero: Updating hero image to:', newImage);
      setHeroImage(newImage);
    };

    // Initial load
    updateHeroImage();

    // Listen for image updates
    const handleImagesUpdate = () => {
      updateHeroImage();
    };

    window.addEventListener('otherImagesUpdated', handleImagesUpdate);
    window.addEventListener('storage', handleImagesUpdate);
    
    return () => {
      window.removeEventListener('otherImagesUpdated', handleImagesUpdate);
      window.removeEventListener('storage', handleImagesUpdate);
    };
  }, []);

  return (
    <div className="relative h-screen bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('${heroImage}')`,
          filter: "brightness(0.9)"
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
      
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
          Apartmán Tília
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl animate-slide-in-bottom opacity-0" style={{animationDelay: "0.2s"}}>
          Príjemné ubytovanie v blízkosti aquaparku Bešeňová
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-in-bottom opacity-0" style={{animationDelay: "0.4s"}}>
          <Button size="lg" className="bg-booking-primary hover:bg-booking-secondary">
            <Link to="galeria" spy={true} smooth={true} offset={-100} duration={500}>
              Prezrieť galériu
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
            <Link to="rezervacia" spy={true} smooth={true} offset={-100} duration={500}>
              Rezervovať pobyt
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
