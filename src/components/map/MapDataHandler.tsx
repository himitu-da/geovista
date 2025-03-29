
import React, { useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { CountryData, DataMetric } from '@/types/country';
import L from 'leaflet';
import { styleFeature, generateCountryTooltip, resetLayerStyle } from './handlers/FeatureHandlers';
import { transformToGeoJson, fitMapToCountry } from './handlers/GeoJsonTransformer';
import MapPopup from './MapPopup';
import { motion, AnimatePresence } from 'framer-motion';

interface MapDataHandlerProps {
  countries: CountryData[];
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}

/**
 * マップデータを処理し表示するコンポーネント
 */
const MapDataHandler: React.FC<MapDataHandlerProps> = ({
  countries,
  selectedMetric,
  selectedCountry,
  onCountrySelect
}) => {
  const map = useMap();
  const [popupInfo, setPopupInfo] = React.useState<{
    position: [number, number];
    content: string;
    isOpen: boolean;
  } | null>(null);
  
  // 選択された国にズームする効果
  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.id === selectedCountry);
      fitMapToCountry(country, map);
    }
  }, [selectedCountry, countries, map]);
  
  // フィーチャークリック時のハンドラー
  const onFeatureClick = (event: any) => {
    const layer = event.target;
    const feature = layer.feature;
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
  
  // マウスオーバー時のハンドラー
  const onFeatureMouseover = (event: any) => {
    const layer = event.target;
    const feature = layer.feature;
    const props = feature.properties;
    
    map.getContainer().style.cursor = 'pointer';
    
    // ツールチップ情報の生成
    const tooltipInfo = generateCountryTooltip(props, selectedMetric);
    
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
  
  // マウスアウト時のハンドラー
  const onFeatureMouseout = (event: any) => {
    const layer = event.target;
    
    map.getContainer().style.cursor = '';
    setPopupInfo(prev => prev ? { ...prev, isOpen: false } : null);
    
    // 選択されていない国はスタイルをリセット
    resetLayerStyle(layer, selectedCountry);
  };
  
  // GeoJSONデータの変換
  const countryGeoJson = React.useMemo(() => {
    return transformToGeoJson(countries);
  }, [countries]);
  
  // 各フィーチャーのスタイル関数
  const applyFeatureStyle = (feature: any) => {
    return styleFeature(feature, selectedCountry, selectedMetric);
  };
  
  // 選択されている国が画面の焦点に来るようにアニメーション
  useEffect(() => {
    if (selectedCountry && map) {
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
    }
  }, [selectedCountry, map, countryGeoJson]);
  
  return (
    <>
      {countryGeoJson && (
        <GeoJSON
          data={countryGeoJson as any}
          style={applyFeatureStyle}
          onEachFeature={(feature, layer) => {
            layer.on({
              mouseover: onFeatureMouseover,
              mouseout: onFeatureMouseout,
              click: onFeatureClick
            });
          }}
        />
      )}
      
      <AnimatePresence>
        {popupInfo && (
          <MapPopup
            position={popupInfo.position}
            content={popupInfo.content}
            isOpen={popupInfo.isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MapDataHandler;
