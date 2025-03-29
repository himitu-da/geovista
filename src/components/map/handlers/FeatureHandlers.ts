
import L from 'leaflet';

/**
 * ホバー時の国の情報を生成する関数
 */
export const generateCountryTooltip = (props: any): { 
  title: string; 
  value: string;
  formattedValue: string;
} => {
  return {
    title: props.name,
    value: `人口`,
    formattedValue: `${Number(props.population).toLocaleString()} 人`
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
