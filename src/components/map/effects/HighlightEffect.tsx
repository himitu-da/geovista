// src/components/map/effects/HighlightEffect.tsx
import { useEffect, useRef } from 'react';
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
  // マーカーのレイヤー参照を保持
  const markerLayerRef = useRef<L.CircleMarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // クリーンアップ関数
  const cleanupEffect = () => {
    if (markerLayerRef.current && map) {
      map.removeLayer(markerLayerRef.current);
      markerLayerRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
  
  // 選択されている国が画面の焦点に来るようにアニメーション
  useEffect(() => {
    // クリーンアップ
    cleanupEffect();
    
    if (!selectedCountry || !map || !countryGeoJson) return;
    
    const highlightPulse = () => {
      const selectedFeature = countryGeoJson?.features.find(
        (feature: any) => feature.properties.id === selectedCountry
      );
      
      if (!selectedFeature) return;
      
      try {
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
        
        markerLayerRef.current = marker;
        
        // パルスアニメーション変数
        let scale = 1;
        let opacity = 0.4;
        let growing = false;
        
        // アニメーション関数
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
          
          if (marker && map.hasLayer(marker)) {
            marker.setStyle({
              radius: 15 * scale,
              fillOpacity: Math.max(0.1, opacity)
            });
            
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };
        
        // アニメーション開始
        animationFrameRef.current = requestAnimationFrame(animate);
        
      } catch (error) {
        console.error('Error creating highlight effect:', error);
      }
    };
    
    highlightPulse();
    
    // クリーンアップ
    return cleanupEffect;
  }, [selectedCountry, map, countryGeoJson]);
  
  return null;
};

export default HighlightEffect;