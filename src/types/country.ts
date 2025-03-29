
export interface CountryData {
  id: string;
  name: string;
  code: string;
  population: number;
  area_km2: number | null;
  geometry: GeoJSON.Feature;
}

export interface CountryDataState {
  countries: CountryData[];
  loading: boolean;
  error: string | null;
}
