
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
  if (!country || !country.geometry || !country.geometry.geometry || !map) return false;
  
  try {
    // GeoJSONオブジェクトを作成
    const geoJSON = L.geoJSON(country.geometry.geometry as any);
    
    // 境界を取得し、地図をこれらの境界に合わせる
    const bounds = geoJSON.getBounds();
    
    // デフォルトのオプションを設定し、ユーザーが提供したオプションで上書き
    // paddingをPointExpression型(L.Point | [number, number])に変更
    const flyOptions = {
      padding: [20, 20] as L.PointTuple, // 型キャストで明示的に指定
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
