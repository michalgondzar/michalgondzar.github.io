
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current || !window.google?.maps) return;

      // Koordináty pre Bešeňová
      const besenova = { lat: 49.1029, lng: 19.4136 };

      // Vytvorenie mapy
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
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
        title: "Apartmán Tília - Bešeňová"
      });

      // Pridanie info okna
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">Apartmán Tília</h3>
            <p style="margin: 0; color: #666;">Bešeňová, Slovensko</p>
            <p style="margin: 4px 0 0 0; color: #666;">10 minút pešo od aquaparku</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
    };

    // Načítanie Google Maps API ak ešte nie je načítané
    if (window.google?.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCaOISTnJMn5htSCekRXIUf7_-mRj7Q8hk&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
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
