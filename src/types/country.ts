export interface CountryData {
  id: string;
  name: string;
  code: string;
  population: number;
  area_km2: number | null;
  geometry: GeoJSON.Feature;
  gdp_per_capita?: number;
  population_density?: number;
}

export interface CountryDataState {
  countries: CountryData[];
  loading: boolean;
  error: string | null;
}

export type DataMetric = 'population_density' | 'population' | 'gdp_per_capita';
