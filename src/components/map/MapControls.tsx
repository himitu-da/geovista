
import React from 'react';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';
import L from 'leaflet';

interface MapControlsProps {
  mapRef: L.Map | null;
}

/**
 * マップコントロールコンポーネント
 * 簡素化バージョン - ズームとリセットのみ
 */
const MapControls: React.FC<MapControlsProps> = ({ mapRef }) => {
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
  );
};

export default MapControls;
