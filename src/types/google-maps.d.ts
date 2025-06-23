
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

    interface MapConstructor {
      new (mapDiv: HTMLElement, opts?: MapOptions): Map;
    }

    interface MarkerConstructor {
      new (opts?: MarkerOptions): Marker;
    }

    interface InfoWindowConstructor {
      new (opts?: InfoWindowOptions): InfoWindow;
    }

    interface MapTypeId {
      ROADMAP: string;
      SATELLITE: string;
      HYBRID: string;
      TERRAIN: string;
    }
  }
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: google.maps.MapConstructor;
        Marker: google.maps.MarkerConstructor;
        InfoWindow: google.maps.InfoWindowConstructor;
        MapTypeId: google.maps.MapTypeId;
      };
    };
  }
}

export {};
