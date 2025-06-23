
declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
        addListener(eventName: string, handler: () => void): void;
      }
      
      class Marker {
        constructor(opts?: MarkerOptions);
        addListener(eventName: string, handler: () => void): void;
      }
      
      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map: Map, anchor?: Marker): void;
      }

      interface MapOptions {
        zoom?: number;
        center?: LatLngLiteral;
        mapTypeId?: string;
        styles?: MapTypeStyle[];
      }
      
      interface MarkerOptions {
        position?: LatLngLiteral;
        map?: Map;
        title?: string;
      }
      
      interface InfoWindowOptions {
        content?: string;
      }
      
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
      
      interface MapTypeStyle {
        featureType?: string;
        elementType?: string;
        stylers?: Array<{ [key: string]: string }>;
      }

      const MapTypeId: {
        ROADMAP: string;
        SATELLITE: string;
        HYBRID: string;
        TERRAIN: string;
      };
    }
  }

  interface Window {
    google?: {
      maps?: typeof google.maps;
    };
  }
}

export {};
