
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  className?: string;
}

// Globálna callback funkcia
declare global {
  interface Window {
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current || !window.google?.maps) return;

    // Správne súradnice pre Bešeňová 155
    const besenova = { lat: 49.0963, lng: 19.4169 };

    // Vytvorenie mapy
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 16,
      center: besenova,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Pridanie markera
    const marker = new window.google.maps.Marker({
      position: besenova,
      map: mapInstanceRef.current,
      title: "Apartmán Tília - Bešeňová 155"
    });

    // Pridanie info okna
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 8px 0; color: #333;">Apartmán Tília</h3>
          <p style="margin: 0; color: #666;">Bešeňová 155, Slovensko</p>
          <p style="margin: 4px 0 0 0; color: #666;">10 minút pešo od aquaparku</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, marker);
    });
  };

  useEffect(() => {
    // Nastavenie globálnej callback funkcie
    window.initMap = initializeMap;

    // Ak je Google Maps už načítané, inicializuj mapu
    if (window.google?.maps) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
};

export default GoogleMap;
