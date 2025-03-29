import L from 'leaflet';
import { generateCountryTooltip, resetLayerStyle } from './FeatureHandlers';

/**
 * Leafletのフィーチャータイプ定義
 */
interface LeafletFeature {
  properties: {
    id: string;
    name: string;
    code: string;
    population: number;
    area_km2: number | null;
    gdp_per_capita: number;
  };
}

/**
 * マウスオーバー時のハンドラー生成関数
 */
export const createMouseOverHandler = (
  map: L.Map,
  setPopupInfo: (info: { position: [number, number]; content: string; isOpen: boolean; } | null) => void
) => {
  return (event: L.LeafletEvent) => {
    const layer = event.target as L.GeoJSON;
    const feature = layer.feature as LeafletFeature;
    const props = feature.properties;
    
    map.getContainer().style.cursor = 'pointer';
    
    // ツールチップ情報の生成
    const tooltipInfo = generateCountryTooltip(props);
    
    // レイヤーの境界から中心点を計算
    const bounds = layer.getBounds();
    const center = bounds.getCenter();
    
    // ポップアップ表示
    setPopupInfo({
      position: [center.lat, center.lng],
      content: `
        <div class="py-1 px-2">
          <h3 class="font-medium text-sm text-gray-900">${tooltipInfo.title}</h3>
          <p class="text-xs text-gray-700">${tooltipInfo.value}: <span class="font-medium">${tooltipInfo.formattedValue}</span></p>
        </div>
      `,
      isOpen: true
    });
    
    // ホバースタイルの適用
    layer.setStyle({
      weight: 2,
      fillOpacity: 0.85,
      dashArray: ''
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };
};

/**
 * マウスアウト時のハンドラー生成関数
 */
export const createMouseOutHandler = (
  map: L.Map,
  selectedCountry: string | null,
  setPopupInfo: (info: { position: [number, number]; content: string; isOpen: boolean; } | null) => void
) => {
  return (event: L.LeafletEvent) => {
    const layer = event.target as L.GeoJSON;
    
    map.getContainer().style.cursor = '';
    
    // 関数型を修正 - 直接オブジェクトを返すようにする
    setPopupInfo(null);
    
    // 選択されていない国はスタイルをリセット
    resetLayerStyle(layer, selectedCountry);
  };
};

/**
 * クリック時のハンドラー生成関数
 */
export const createClickHandler = (
  map: L.Map,
  selectedCountry: string | null,
  onCountrySelect: (countryId: string | null) => void
) => {
  return (event: L.LeafletEvent) => {
    const layer = event.target as L.GeoJSON;
    const feature = layer.feature as LeafletFeature;
    const countryId = feature.properties.id;
    
    // クリックアニメーション
    map.getContainer().style.cursor = 'pointer';
    
    // 選択の切り替え
    if (countryId === selectedCountry) {
      onCountrySelect(null);
      map.flyTo([20, 0], 2, { duration: 1 });
    } else {
      onCountrySelect(countryId);
    }
  };
};
