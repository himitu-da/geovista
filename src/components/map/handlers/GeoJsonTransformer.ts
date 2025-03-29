// src/components/map/handlers/GeoJsonTransformer.ts
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
        // geometry形式の確認と適切な処理
        let geometry;
        if (country.geometry) {
          if (typeof country.geometry === 'object') {
            if ('geometry' in country.geometry) {
              // 既にFeature形式の場合はgeometryプロパティを取り出す
              geometry = country.geometry.geometry;
            } else {
              // geometryオブジェクトが直接存在する場合はそのまま使用
              geometry = country.geometry;
            }
          }
        }
        
        // geometryがない場合のフォールバック
        if (!geometry) {
          geometry = { type: 'Polygon', coordinates: [] };
          console.warn(`Warning: No valid geometry for country ${country.name}`);
        }
        
        return {
          type: 'Feature',
          properties: {
            id: country.id,
            name: country.name,
            code: country.code,
            population: country.population,
            area_km2: country.area_km2,
            gdp_per_capita: country.gdp_per_capita || 0,
            population_density: country.population_density || 
              (country.area_km2 ? country.population / country.area_km2 : 0)
          },
          geometry
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
 * @param country 移動対象の国
 * @param map 地図オブジェクト
 * @param options 追加のオプション
 * @returns 移動が成功したかどうか
 */
export const fitMapToCountry = (
  country: CountryData | undefined, 
  map: L.Map,
  options?: { duration?: number, maxZoom?: number }
) => {
  if (!country || !country.geometry || !map) return false;
  
  try {
    // GeoJSONオブジェクトを作成
    let geometry;
    
    if (typeof country.geometry === 'object') {
      if ('geometry' in country.geometry) {
        geometry = country.geometry.geometry;
      } else {
        geometry = country.geometry;
      }
    }
    
    if (!geometry) {
      console.warn(`Warning: Cannot fit to country ${country.name} - invalid geometry`);
      return false;
    }
    
    const geoJSON = L.geoJSON(geometry as any);
    
    // 境界を取得し、地図をこれらの境界に合わせる
    const bounds = geoJSON.getBounds();
    
    // デフォルトのオプションを設定し、ユーザーが提供したオプションで上書き
    const flyOptions = {
      padding: [20, 20] as [number, number], // 型をPointTuple（[number, number]）に明示的に指定
      maxZoom: options?.maxZoom || 5,
      duration: options?.duration || 0.75,
      easeLinearity: 0.25
    };
    
    map.flyToBounds(bounds, flyOptions);
    
    // マップのドラッグとズーム機能を常に有効に保つ
    if (!map.dragging.enabled()) map.dragging.enable();
    if (!map.scrollWheelZoom.enabled()) map.scrollWheelZoom.enable();
    if (!map.touchZoom.enabled()) map.touchZoom.enable();
    
    return true;
  } catch (error) {
    console.error('Error fitting bounds:', error);
    return false;
  }
};