
import { useEffect } from 'react';
import L from 'leaflet';

interface HighlightEffectProps {
  map: L.Map | null;
  selectedCountry: string | null;
  countryGeoJson: any;
}

/**
 * 選択された国のハイライトエフェクト
 */
const HighlightEffect: React.FC<HighlightEffectProps> = ({
  map,
  selectedCountry,
  countryGeoJson
}) => {
  // 選択されている国が画面の焦点に来るようにアニメーション
  useEffect(() => {
    if (!selectedCountry || !map || !countryGeoJson) return;
    
    const highlightPulse = () => {
      const selectedFeature = countryGeoJson?.features.find(
        (feature: any) => feature.properties.id === selectedCountry
      );
      
      if (selectedFeature) {
        const geoJSON = L.geoJSON(selectedFeature.geometry as any);
        const bounds = geoJSON.getBounds();
        const center = bounds.getCenter();
        
        // ハイライトマーカーを追加
        const marker = L.circleMarker([center.lat, center.lng], {
          radius: 15,
          color: '#4299e1',
          fillColor: '#4299e1',
          fillOpacity: 0.4,
          weight: 2,
          opacity: 0.8
        }).addTo(map);
        
        // パルスアニメーション
        let scale = 1;
        let opacity = 0.4;
        let growing = false;
        
        const animate = () => {
          if (growing) {
            scale += 0.05;
            opacity -= 0.01;
            if (scale >= 2) {
              growing = false;
            }
          } else {
            scale -= 0.05;
            opacity += 0.01;
            if (scale <= 1) {
              growing = true;
            }
          }
          
          marker.setStyle({
            radius: 15 * scale,
            fillOpacity: Math.max(0.1, opacity)
          });
          
          setTimeout(animate, 50);
        };
        
        animate();
        
        // クリーンアップ
        return () => {
          map.removeLayer(marker);
        };
      }
    };
    
    const cleanup = highlightPulse();
    return cleanup;
  }, [selectedCountry, map, countryGeoJson]);
  
  return null;
};

export default HighlightEffect;
