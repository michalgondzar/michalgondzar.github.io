
import { useState, useEffect } from "react";
import { getImageByUsage } from "@/hooks/useOtherImagesManager";

export const Logo = ({ white = false }: { white?: boolean }) => {
  const [logoImage, setLogoImage] = useState(getImageByUsage('logo'));

  useEffect(() => {
    const handleImagesUpdate = () => {
      setLogoImage(getImageByUsage('logo'));
    };

    window.addEventListener('otherImagesUpdated', handleImagesUpdate);
    return () => window.removeEventListener('otherImagesUpdated', handleImagesUpdate);
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
