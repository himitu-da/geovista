// src/components/map/handlers/MouseEventHandlers.ts
import L from 'leaflet';
import { generateCountryTooltip, resetLayerStyle } from './FeatureHandlers';
import { DataMetric } from '@/types/country';

/**
 * Leafletの拡張レイヤー型定義
 */
interface ExtendedLayer extends L.Layer {
  feature?: any;
  getBounds?: () => L.LatLngBounds;
  setStyle?: (style: L.PathOptions) => void;
  bringToFront?: () => void;
}

/**
 * マウスオーバー時のハンドラー生成関数
 */
export const createMouseOverHandler = (
  map: L.Map,
  selectedMetric: DataMetric,
  setPopupInfo: (info: { position: [number, number]; content: string; isOpen: boolean; } | null) => void
) => {
  return (event: L.LeafletEvent) => {
    const layer = event.target as ExtendedLayer;
    
    if (!layer.feature) {
      console.warn('Invalid feature in mouseover event');
      return;
    }
    
    const props = layer.feature.properties;
    if (!props) {
      console.warn('Invalid properties in feature');
      return;
    }
    
    map.getContainer().style.cursor = 'pointer';
    
    // ツールチップ情報の生成
    const tooltipInfo = generateCountryTooltip(props, selectedMetric);
    
    // レイヤーの境界から中心点を計算
    if (!layer.getBounds) {
      console.warn('Layer does not have getBounds method');
      return;
    }
    
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
    
    // ホバースタイルの適用（setStyleメソッドがあることを確認）
    if (layer.setStyle) {
      layer.setStyle({
        weight: 2,
        fillOpacity: 0.85,
        dashArray: ''
      });
    }
    
    if (layer.bringToFront && !L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
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
    const layer = event.target as ExtendedLayer;
    
    map.getContainer().style.cursor = '';
    
    // ポップアップを閉じる
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
    const layer = event.target as ExtendedLayer;
    
    if (!layer.feature || !layer.feature.properties) {
      console.warn('Invalid feature in click event');
      return;
    }
    
    const countryId = layer.feature.properties.id;
    
    if (!countryId) {
      console.warn('Country ID not found in feature properties');
      return;
    }
    
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