
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Leafletのデフォルトアイコンの初期化関数
 * Leafletのデフォルトアイコンの問題を修正するためのユーティリティ関数
 */
export const initializeLeafletIcons = () => {
  // デフォルトアイコンの初期化
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  // グローバルなLeafletマーカーのデフォルトアイコンを設定
  L.Marker.prototype.options.icon = DefaultIcon;
};
