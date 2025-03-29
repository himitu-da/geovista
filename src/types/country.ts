
export interface CountryData {
  id: string;
  name: string;
  code: string;
  population: number;
  area_km2: number | null;
  geometry: GeoJSON.Feature;
  gdp_per_capita?: number;
}

export interface CountryDataState {
  countries: CountryData[];
  loading: boolean;
  error: string | null;
}

// データ指標の型定義（シンプル版）
export type DataMetric = 'population' | 'population_density' | 'gdp_per_capita';
