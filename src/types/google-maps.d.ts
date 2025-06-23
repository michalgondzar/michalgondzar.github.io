
// Extend the global Window interface to include google
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (mapDiv: Element, opts?: any) => any;
        Marker: new (opts?: any) => any;
        InfoWindow: new (opts?: any) => any;
        Size: new (width: number, height: number) => any;
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

export {};
