
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (mapDiv: HTMLElement, opts?: google.maps.MapOptions) => google.maps.Map;
        Marker: new (opts?: google.maps.MarkerOptions) => google.maps.Marker;
        InfoWindow: new (opts?: google.maps.InfoWindowOptions) => google.maps.InfoWindow;
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
          HYBRID: string;
          TERRAIN: string;
        };
      };
    };
  }
}

declare namespace google {
  namespace maps {
    interface Map {
      addListener(eventName: string, handler: () => void): void;
    }
    
    interface Marker {
      addListener(eventName: string, handler: () => void): void;
    }
    
    interface InfoWindow {
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
  }
}

export {};
