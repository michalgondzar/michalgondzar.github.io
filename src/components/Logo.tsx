
import { useState, useEffect } from "react";
import { getImageByUsage } from "@/hooks/useOtherImagesManager";

export const Logo = ({ white = false }: { white?: boolean }) => {
  const [logoImage, setLogoImage] = useState(getImageByUsage('logo'));

  useEffect(() => {
    const handleImagesUpdate = () => {
      const newLogo = getImageByUsage('logo');
      console.log('Logo: Updating logo image to:', newLogo);
      setLogoImage(newLogo);
    };

    // Initial load to make sure we have the latest image
    handleImagesUpdate();

    // Listen for image updates
    window.addEventListener('otherImagesUpdated', handleImagesUpdate);
    
    // Also listen for storage changes in case of direct localStorage updates
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
