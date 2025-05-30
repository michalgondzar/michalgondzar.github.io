
import { useState, useEffect } from "react";
import { getImageByUsage } from "@/hooks/useOtherImagesManager";

export const Logo = ({ white = false }: { white?: boolean }) => {
  const [logoImage, setLogoImage] = useState('');

  useEffect(() => {
    const updateLogoImage = () => {
      const newLogo = getImageByUsage('logo');
      console.log('Logo: Updating logo image to:', newLogo);
      setLogoImage(newLogo);
    };

    // Initial load
    updateLogoImage();

    // Listen for image updates
    const handleImagesUpdate = () => {
      updateLogoImage();
    };

    window.addEventListener('otherImagesUpdated', handleImagesUpdate);
    window.addEventListener('storage', handleImagesUpdate);
    
    return () => {
      window.removeEventListener('otherImagesUpdated', handleImagesUpdate);
      window.removeEventListener('storage', handleImagesUpdate);
    };
  }, []);

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
