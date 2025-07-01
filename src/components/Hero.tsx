
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-scroll";
import { getImageByUsage } from "@/hooks/useOtherImagesManager";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const [heroImage, setHeroImage] = useState('');
  const { t } = useLanguage();

  const updateHeroImage = () => {
    const newImage = getImageByUsage('hero-background');
    console.log('Hero: Updating hero image to:', newImage);
    setHeroImage(newImage);
  };

  useEffect(() => {
    // Initial load
    updateHeroImage();

    // Listen for all possible image update events
    const handleImagesUpdate = () => {
      console.log('Hero: Received image update event');
      updateHeroImage();
    };

    // Window events
    window.addEventListener('otherImagesUpdated', handleImagesUpdate);
    window.addEventListener('storage', handleImagesUpdate);
    window.addEventListener('forceImageRefresh', handleImagesUpdate);
    
    // Document events pre cross-page komunikáciu
    document.addEventListener('globalImageUpdate', handleImagesUpdate);
    
    return () => {
      window.removeEventListener('otherImagesUpdated', handleImagesUpdate);
      window.removeEventListener('storage', handleImagesUpdate);
      window.removeEventListener('forceImageRefresh', handleImagesUpdate);
      document.removeEventListener('globalImageUpdate', handleImagesUpdate);
    };
  }, []);

  // Pridáme aj useEffect pre sledovanie zmien v localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const currentImage = getImageByUsage('hero-background');
      if (currentImage !== heroImage) {
        console.log('Hero: Detected image change via polling');
        setHeroImage(currentImage);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [heroImage]);

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
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl animate-slide-in-bottom opacity-0" style={{animationDelay: "0.2s"}}>
          {t('hero.stay')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-in-bottom opacity-0" style={{animationDelay: "0.4s"}}>
          <Button size="lg" className="bg-booking-primary hover:bg-booking-secondary">
            <Link to="galeria" spy={true} smooth={true} offset={-100} duration={500}>
              {t('hero.gallery')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
            <Link to="rezervacia" spy={true} smooth={true} offset={-100} duration={500}>
              {t('hero.book')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
