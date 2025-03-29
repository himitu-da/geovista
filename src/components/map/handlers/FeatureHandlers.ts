
import L from 'leaflet';
import { DataMetric } from '@/types/country';
import { getColorForValue } from '@/utils/mapUtils';

/**
 * GeoJSONフィーチャーのスタイルを設定する関数
 */
export const styleFeature = (feature: any, selectedCountry: string | null, selectedMetric: DataMetric) => {
  const countryId = feature.properties.id;
  const isSelected = countryId === selectedCountry;
  
  let value: number | null = null;
  
  if (selectedMetric === 'population_density') {
    const population = feature.properties.population || 0;
    const area = feature.properties.area_km2;
    value = area ? population / area : null;
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
  
  if (selectedMetric === 'population_density' && props.area_km2) {
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
 * レイヤーをリセットする関数
 */
export const resetLayerStyle = (layer: L.Layer, selectedCountry: string | null) => {
  if ((layer as any).feature.properties.id !== selectedCountry) {
    (layer as any).setStyle({
      weight: 1,
      fillOpacity: 0.75,  // 常に高い不透明度を維持
      dashArray: '1'      // 細かいダッシュに変更
    });
  }
};
