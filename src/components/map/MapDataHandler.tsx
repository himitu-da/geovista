
import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { CountryData } from '@/types/country';
import { fitMapToCountry } from './handlers/GeoJsonTransformer';
import { createMouseOverHandler, createMouseOutHandler, createClickHandler } from './handlers/MouseEventHandlers';
import MapPopup from './MapPopup';
import HighlightEffect from './effects/HighlightEffect';
import { AnimatePresence } from 'framer-motion';
import { COUNTRY_COLOR, COUNTRY_BORDER_COLOR, SELECTED_COUNTRY_COLOR } from '@/utils/mapUtils';

interface MapDataHandlerProps {
  countries: CountryData[];
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}

/**
 * マップデータを処理し表示するコンポーネント
 * シンプル化バージョン
 */
const MapDataHandler: React.FC<MapDataHandlerProps> = ({
  countries,
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
    return {
      type: 'FeatureCollection',
      features: countries.map(country => ({
        type: 'Feature',
        properties: {
          id: country.id,
          name: country.name,
          population: country.population,
          area_km2: country.area_km2,
          gdp_per_capita: country.gdp_per_capita
        },
        geometry: country.geometry
      }))
    };
  }, [countries]);
  
  // インタラクションイベントハンドラーの作成
  const onFeatureMouseover = useMemo(() => 
    createMouseOverHandler(map, setPopupInfo), 
    [map]
  );
  
  const onFeatureMouseout = useMemo(() => 
    createMouseOutHandler(map, selectedCountry, setPopupInfo), 
    [map, selectedCountry]
  );
  
  const onFeatureClick = useMemo(() => 
    createClickHandler(map, selectedCountry, onCountrySelect), 
    [map, selectedCountry, onCountrySelect]
  );
  
  // シンプルなスタイル関数
  const applyFeatureStyle = (feature: any) => {
    const isSelected = feature.properties.id === selectedCountry;
    
    return {
      fillColor: COUNTRY_COLOR,
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: isSelected ? SELECTED_COUNTRY_COLOR : COUNTRY_BORDER_COLOR,
      fillOpacity: isSelected ? 0.7 : 0.5,
      dashArray: isSelected ? '' : '1'
    };
  };
  
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
