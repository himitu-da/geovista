
import React from 'react';
import { ZoomIn, ZoomOut, Home, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import L from 'leaflet';

interface MapControlsProps {
  mapRef: L.Map | null;
}

/**
 * マップコントロールコンポーネント
 * ズーム、リセット、言語切り替え、ホームボタンを含む
 */
const MapControls: React.FC<MapControlsProps> = ({ mapRef }) => {
  const { t } = useLanguage();
  
  // ズームインハンドラー
  const handleZoomIn = () => {
    if (!mapRef) return;
    mapRef.zoomIn();
  };

  // ズームアウトハンドラー
  const handleZoomOut = () => {
    if (!mapRef) return;
    mapRef.zoomOut();
  };

  // 初期位置にリセット
  const handleReset = () => {
    if (!mapRef) return;
    mapRef.setView([20, 0], 2);
  };

  return (
    <>
      {/* 右下のマップコントロール */}
      <div className="absolute right-4 bottom-12 z-[400] flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-md p-1.5 shadow-md text-gray-700 hover:bg-gray-100"
          aria-label="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-md p-1.5 shadow-md text-gray-700 hover:bg-gray-100"
          aria-label="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleReset}
          className="bg-white rounded-md p-1.5 shadow-md text-gray-700 hover:bg-gray-100"
          aria-label="Reset view"
        >
          <Home size={18} />
        </button>
      </div>
      
      {/* 左上のロゴ */}
      <div className="absolute left-4 top-4 z-[400]">
        <Link
          to="/"
          className="bg-white rounded-md p-2 shadow-md text-blue-600 hover:bg-gray-100 flex items-center gap-1.5"
          aria-label="Home"
        >
          <Database size={16} />
          <span className="text-xs font-medium">World Data</span>
        </Link>
      </div>
      
      {/* 右上の言語切り替え */}
      <div className="absolute right-4 top-4 z-[400]">
        <LanguageToggle />
      </div>
    </>
  );
};

export default MapControls;
