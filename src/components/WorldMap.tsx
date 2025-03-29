
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData } from '@/types/country';
import MapDataHandler from './map/MapDataHandler';
import L from 'leaflet';
import MapControls from './map/MapControls';
import LoadingOverlay from './map/LoadingOverlay';
import { initializeLeafletIcons } from './map/leafletUtils';
import MapPinManager from './map/MapPinManager';

// Leafletのデフォルトアイコンの問題を修正
initializeLeafletIcons();

/**
 * マップのコントローラーコンポーネント
 */
function MapController({ setMapRef }: { setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>> }) {
  const map = useMap();
  
  React.useEffect(() => {
    setMapRef(map);
    
    // マップの制限を緩和して自由に動かせるようにする
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    
    // スムーズなズーム効果を有効にする
    map.options.zoomSnap = 0.5;
    map.options.zoomDelta = 0.5;
    
    return () => {
      setMapRef(null);
    };
  }, [map, setMapRef]);
  
  return null;
}

interface WorldMapProps {
  countries: CountryData[];
  loading: boolean;
  onCountrySelect: (countryId: string | null) => void;
  selectedCountry: string | null;
}

/**
 * 世界地図コンポーネント - シンプル化バージョン
 */
const WorldMap: React.FC<WorldMapProps> = ({ 
  countries, 
  loading, 
  onCountrySelect,
  selectedCountry 
}) => {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  return (
    <div className="w-full h-full overflow-hidden">
      {/* 読み込み中オーバーレイ */}
      {loading && <LoadingOverlay />}
      
      {/* 地図コントロール */}
      <MapControls mapRef={mapRef} />
      
      {/* フルスクリーンマップ */}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
        minZoom={1}
        maxZoom={10}
        worldCopyJump={true}
        attributionControl={false}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        {/* 地図コントローラ */}
        <MapController setMapRef={setMapRef} />
        
        {/* マップタイル */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* 国のデータハンドラ */}
        {!loading && countries.length > 0 && (
          <MapDataHandler
            countries={countries}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        )}
        
        {/* ピンマネージャー - 地図上にピンを追加・管理 */}
        <MapPinManager />
      </MapContainer>
      
      {/* 帰属表示オーバーレイ */}
      <div className="absolute bottom-7 right-1 z-[400] text-[7px] sm:text-[8px] text-gray-700 bg-white/80 px-1.5 py-0.5 rounded-tl-md shadow-sm">
        &copy; <a href="https://www.openstreetmap.org/copyright" className="hover:text-blue-600 font-medium">OpenStreetMap</a>
      </div>
      
      {/* ピン追加のためのヘルプテキスト */}
      <div className="absolute bottom-10 left-1 z-[400] text-[7px] sm:text-[9px] text-gray-700 bg-white/80 px-1.5 py-0.5 rounded-md shadow-sm">
        <p className="font-medium">地図上で右クリックするとピンを追加できます</p>
      </div>
    </div>
  );
};

export default WorldMap;
