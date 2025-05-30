
import { useState, useEffect } from "react";
import { getImageByUsage } from "@/hooks/useOtherImagesManager";

export const Logo = ({ white = false }: { white?: boolean }) => {
  const [logoImage, setLogoImage] = useState('');

  const updateLogoImage = () => {
    const newLogo = getImageByUsage('logo');
    console.log('Logo: Updating logo image to:', newLogo);
    setLogoImage(newLogo);
  };

  useEffect(() => {
    // Initial load
    updateLogoImage();

    // Listen for all possible image update events
    const handleImagesUpdate = () => {
      console.log('Logo: Received image update event');
      updateLogoImage();
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
      const currentLogo = getImageByUsage('logo');
      if (currentLogo !== logoImage) {
        console.log('Logo: Detected image change via polling');
        setLogoImage(currentLogo);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [logoImage]);

  return (
    <div className="flex items-center">
      {logoImage ? (
        <img 
          src={logoImage} 
          alt="Apartmán Tília" 
          className="h-8 w-auto mr-2"
        />
      ) : null}
      <span className={`text-2xl font-bold ${white ? 'text-white' : 'text-booking-primary'}`}>
        Apartmán Tília
      </span>
    </div>
  );
};
