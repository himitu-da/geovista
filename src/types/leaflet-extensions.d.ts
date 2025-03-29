// src/types/leaflet-extensions.d.ts
import * as L from 'leaflet';

declare module 'leaflet' {
  // GeoJSONレイヤーのためのフィーチャープロパティ拡張
  interface Layer {
    feature?: {
      type: string;
      properties: {
        id: string;
        name: string;
        code: string;
        population: number;
        area_km2: number | null;
        gdp_per_capita: number | null;
        population_density?: number;
        [key: string]: any;
      };
      geometry: any;
    };
    setStyle?: (style: L.PathOptions) => void;
    getBounds?: () => L.LatLngBounds;
    bringToFront?: () => void;
  }
}

// 拡張GeoJSONフィーチャー型
export interface ExtendedGeoJSONFeature {
  type: string;
  properties: {
    id: string;
    name: string;
    code: string;
    population: number;
    area_km2: number | null;
    gdp_per_capita: number | null;
    population_density?: number;
    [key: string]: any;
  };
  geometry: any;
}