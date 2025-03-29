
import { CountryData } from '@/types/country';
import { captureException } from '@/lib/sentry';
import L from 'leaflet';

/**
 * 国データをGeoJSONに変換する関数
 */
export const transformToGeoJson = (countries: CountryData[]) => {
  if (!countries || countries.length === 0) return null;
  
  try {
    return {
      type: 'FeatureCollection',
      features: countries.map(country => {
        return {
          type: 'Feature',
          properties: {
            id: country.id,
            name: country.name,
            code: country.code,
            population: country.population,
            area_km2: country.area_km2,
            gdp_per_capita: country.gdp_per_capita || 0
          },
          geometry: country.geometry.geometry
        };
      })
    };
  } catch (err) {
    captureException(err);
    console.error('Error creating GeoJSON:', err);
    return null;
  }
};

/**
 * 指定された国に地図を移動する関数
 */
export const fitMapToCountry = (country: CountryData | undefined, map: L.Map) => {
  if (!country || !country.geometry || !country.geometry.geometry || !map) return false;
  
  try {
    // GeoJSONオブジェクトを作成
    const geoJSON = L.geoJSON(country.geometry.geometry as any);
    
    // 境界を取得し、地図をこれらの境界に合わせる
    const bounds = geoJSON.getBounds();
    map.flyToBounds(bounds, { 
      padding: [50, 50], 
      maxZoom: 5, 
      duration: 1, 
      easeLinearity: 0.25
    });
    return true;
  } catch (error) {
    console.error('Error fitting bounds:', error);
    return false;
  }
};
