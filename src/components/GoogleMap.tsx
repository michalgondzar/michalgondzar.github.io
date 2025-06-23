
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  apiKey, 
  center = { lat: 49.10291900000001, lng: 19.413608041796878 }, 
  zoom = 14,
  className = "w-full h-full"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !apiKey) return;

    // Load Google Maps script dynamically
    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadGoogleMaps();
        
        if (!mapRef.current || !window.google || !window.google.maps) return;

        // Initialize the map
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ weight: "2.00" }]
            },
            {
              featureType: "all",
              elementType: "geometry.stroke",
              stylers: [{ color: "#9c9c9c" }]
            },
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [{ visibility: "on" }]
            }
          ]
        });

        // Add marker for Bešeňová
        const marker = new window.google.maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          title: "Apartmán Tília - Bešeňová",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; color: #333;">Apartmán Tília</h3>
              <p style="margin: 0; color: #666;">Bešeňová, Slovensko</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">10 minút pešo od aquaparku</p>
            </div>
          `
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();

    return () => {
      // Cleanup if needed
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey, center.lat, center.lng, zoom]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ minHeight: '300px' }}
    />
  );
};

export default GoogleMap;
