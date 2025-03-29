
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData, DataMetric } from '@/types/country';
import MapDataHandler from './map/MapDataHandler';
import L from 'leaflet';
import MapControls from './map/MapControls';
import SearchOverlay from './map/SearchOverlay';
import CountryInfoOverlay from './map/CountryInfoOverlay';
import LoadingOverlay from './map/LoadingOverlay';
import { initializeLeafletIcons } from './map/leafletUtils';
import { fitMapToCountry } from './map/handlers/GeoJsonTransformer';
import Legend from './Legend';

// Leafletのデフォルトアイコンの問題を修正
initializeLeafletIcons();

/**
 * マップのコントローラーコンポーネント
 * マップの参照を設定する
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
  selectedMetric: DataMetric;
  onCountrySelect: (countryId: string | null) => void;
  selectedCountry: string | null;
}

/**
 * 世界地図コンポーネント
 * 国のデータを地図上に表示し、ユーザーとのインタラクションを管理
 */
const WorldMap: React.FC<WorldMapProps> = ({ 
  countries, 
  loading, 
  selectedMetric,
  onCountrySelect,
  selectedCountry 
}) => {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  /**
   * 国の検索を処理する関数
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !countries.length) return;
    
    const searchLower = searchQuery.toLowerCase();
    const foundCountry = countries.find(country => 
      country.name.toLowerCase().includes(searchLower)
    );
    
    if (foundCountry) {
      onCountrySelect(foundCountry.id);
      navigateToCountry(foundCountry);
    }
  };

  /**
   * 指定された国に地図を移動する関数
   */
  const navigateToCountry = (country: CountryData) => {
    if (!mapRef) return;
    fitMapToCountry(country, mapRef);
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {/* 読み込み中オーバーレイ */}
      {loading && <LoadingOverlay />}
      
      {/* 地図コントロール */}
      <MapControls 
        mapRef={mapRef} 
        setShowSearch={setShowSearch} 
        showSearch={showSearch} 
      />
      
      {/* 検索オーバーレイ */}
      {showSearch && (
        <SearchOverlay 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      )}
      
      {/* 選択された国の情報オーバーレイ */}
      {selectedCountry && countries.length > 0 && (
        <CountryInfoOverlay 
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={onCountrySelect}
        />
      )}
      
      {/* フルスクリーンマップ */}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
        minZoom={1}  // 最小ズームレベルを小さく設定
        maxZoom={10} // 最大ズームレベルを大きく設定
        worldCopyJump={true} // 日付変更線を超えても世界地図を表示できるようにする
        attributionControl={false}
        // 以下の制限を取り外す
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
            selectedMetric={selectedMetric}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        )}
      </MapContainer>
      
      {/* 左下に凡例を表示 */}
      <div className="absolute bottom-2 left-2 z-[400]">
        <Legend metric={selectedMetric} />
      </div>
      
      {/* 帰属表示オーバーレイ */}
      <div className="absolute bottom-0.5 right-0.5 z-[400] text-[6px] sm:text-[8px] text-gray-700 bg-white/80 px-1 py-0.5 rounded-tl-md shadow-sm">
        &copy; <a href="https://www.openstreetmap.org/copyright" className="hover:text-blue-600 font-medium">OpenStreetMap</a>
      </div>
    </div>
  );
};

export default WorldMap;
