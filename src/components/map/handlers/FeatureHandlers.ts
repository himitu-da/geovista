// src/components/map/handlers/FeatureHandlers.ts
import L from 'leaflet';
import { DataMetric } from '@/types/country';
import { getColorForValue } from '@/utils/mapUtils';

/**
 * GeoJSON Featureの型定義拡張
 */
interface ExtendedLayer extends L.Layer {
  feature?: any;
  setStyle?: (style: L.PathOptions) => void;
}

/**
 * GeoJSONフィーチャーのスタイルを設定する関数
 */
export const styleFeature = (feature: any, selectedCountry: string | null, selectedMetric: DataMetric) => {
  const countryId = feature.properties.id;
  const isSelected = countryId === selectedCountry;
  
  let value: number | null = null;
  
  // 選択された指標に基づいてスタイル値を計算
  if (selectedMetric === 'population_density') {
    const population = feature.properties.population || 0;
    const area = feature.properties.area_km2;
    value = area && area > 0 ? population / area : null;
  } else if (selectedMetric === 'population') {
    value = feature.properties.population;
  } else if (selectedMetric === 'gdp_per_capita') {
    value = feature.properties.gdp_per_capita || 0;
  }
  
  return {
    fillColor: getColorForValue(value, selectedMetric),
    weight: isSelected ? 2 : 1,
    opacity: 1,
    color: isSelected ? '#0071e3' : '#666',
    fillOpacity: isSelected ? 0.85 : 0.75,
    dashArray: isSelected ? '' : '1'
  };
};

/**
 * ホバー時の国の情報を生成する関数
 */
export const generateCountryTooltip = (props: any, selectedMetric: DataMetric): { 
  title: string; 
  value: string;
  formattedValue: string;
} => {
  let valueToShow = '';
  let formattedValue = '';
  
  if (selectedMetric === 'population_density' && props.area_km2 && props.area_km2 > 0) {
    const density = props.population / props.area_km2;
    valueToShow = `人口密度`;
    formattedValue = `${density.toFixed(1)} 人/km²`;
  } else if (selectedMetric === 'gdp_per_capita' && props.gdp_per_capita) {
    valueToShow = `一人当たりGDP`;
    formattedValue = `$${Number(props.gdp_per_capita).toLocaleString()}`;
  } else {
    valueToShow = `人口`;
    formattedValue = `${Number(props.population).toLocaleString()} 人`;
  }
  
  return {
    title: props.name,
    value: valueToShow,
    formattedValue
  };
};

/**
 * レイヤーのスタイルをリセットする関数
 */
export const resetLayerStyle = (layer: L.Layer, selectedCountry: string | null) => {
  // 拡張型を使用して型エラーを回避
  const extendedLayer = layer as ExtendedLayer;
  
  if (extendedLayer.feature && extendedLayer.setStyle && 
      extendedLayer.feature.properties && 
      extendedLayer.feature.properties.id !== selectedCountry) {
    
    extendedLayer.setStyle({
      weight: 1,
      fillOpacity: 0.75,
      dashArray: '1'
    });
  }
};