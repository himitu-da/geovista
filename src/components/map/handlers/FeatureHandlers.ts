
import L from 'leaflet';
import { DataMetric } from '@/types/country';

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
      fillOpacity: 0.5,
      dashArray: '1'
    });
  }
};
