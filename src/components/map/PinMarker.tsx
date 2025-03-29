
import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationDescription from './LocationDescription';

interface PinMarkerProps {
  position: [number, number];
  onRemove: () => void;
  onGenerateDescription: (position: [number, number]) => Promise<string>;
}

// カスタムピンアイコンの設定
const customPinIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

/**
 * ピンマーカーコンポーネント
 */
const PinMarker: React.FC<PinMarkerProps> = ({ position, onRemove, onGenerateDescription }) => {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);

  // 説明の生成
  const handleGenerateDescription = async () => {
    setLoading(true);
    try {
      const generatedDescription = await onGenerateDescription(position);
      setDescription(generatedDescription);
    } catch (error) {
      console.error('Failed to generate description:', error);
      setDescription('説明の生成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Marker 
      position={position} 
      icon={customPinIcon}
      eventHandlers={{
        popupopen: () => setIsPopupOpen(true),
        popupclose: () => setIsPopupOpen(false),
      }}
    >
      <Popup className="location-popup">
        <div className="w-72 p-1 max-w-full">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
              選択された場所
            </h3>
            <Button 
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs mb-2 bg-gray-50 p-2 rounded">
            <div className="grid grid-cols-2 gap-1">
              <div>緯度: <span className="font-medium">{position[0].toFixed(4)}</span></div>
              <div>経度: <span className="font-medium">{position[1].toFixed(4)}</span></div>
            </div>
          </div>
          
          {!description ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={handleGenerateDescription}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  生成中...
                </>
              ) : (
                '場所の説明を生成'
              )}
            </Button>
          ) : (
            <div className="bg-white p-2 rounded border max-h-[350px] overflow-y-auto">
              <LocationDescription description={description} />
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;
