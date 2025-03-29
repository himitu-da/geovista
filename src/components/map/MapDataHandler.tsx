// src/components/map/MapDataHandler.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { CountryData, DataMetric } from '@/types/country';
import { styleFeature } from './handlers/FeatureHandlers';
import { transformToGeoJson, fitMapToCountry } from './handlers/GeoJsonTransformer';
import { createMouseOverHandler, createMouseOutHandler, createClickHandler } from './handlers/MouseEventHandlers';
import MapPopup from './MapPopup';
import HighlightEffect from './effects/HighlightEffect';
import { AnimatePresence } from 'framer-motion';

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
  const [popupInfo, setPopupInfo] = useState<{
    position: [number, number];
    content: string;
    isOpen: boolean;
  } | null>(null);
  
  // 選択された国にズームする効果
  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.id === selectedCountry);
      
      if (country) {
        fitMapToCountry(country, map, { duration: 0.5 });
      }
    }
  }, [selectedCountry, countries, map]);
  
  // GeoJSONデータの変換
  const countryGeoJson = useMemo(() => {
    return transformToGeoJson(countries);
  }, [countries]);
  
  // インタラクションイベントハンドラーの作成
  const onFeatureMouseover = useMemo(() => 
    createMouseOverHandler(map, selectedMetric, setPopupInfo), 
    [map, selectedMetric]
  );
  
  const onFeatureMouseout = useMemo(() => 
    createMouseOutHandler(map, selectedCountry, setPopupInfo), 
    [map, selectedCountry]
  );
  
  const onFeatureClick = useMemo(() => 
    createClickHandler(map, selectedCountry, onCountrySelect), 
    [map, selectedCountry, onCountrySelect]
  );
  
  // 各フィーチャーのスタイル関数
  const applyFeatureStyle = (feature: any) => {
    return styleFeature(feature, selectedCountry, selectedMetric);
  };
  
  return (
    <>
      {countryGeoJson && (
        <GeoJSON
          key={`geojson-${selectedMetric}`} // メトリック変更時に強制的に再レンダリング
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
      
      <HighlightEffect 
        map={map}
        selectedCountry={selectedCountry}
        countryGeoJson={countryGeoJson}
      />
      
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