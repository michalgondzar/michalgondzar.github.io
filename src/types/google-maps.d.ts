
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      addListener(eventName: string, handler: Function): void;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeId?: MapTypeId;
      styles?: MapTypeStyle[];
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface InfoWindowOptions {
      content?: string | Element;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: any[];
    }

    enum MapTypeId {
      ROADMAP = "roadmap",
      SATELLITE = "satellite",
      HYBRID = "hybrid",
      TERRAIN = "terrain"
    }
  }
}

export {};
