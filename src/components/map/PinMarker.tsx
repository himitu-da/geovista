
import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';
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
        <div className="w-64 p-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">選択された場所</h3>
            <Button 
              variant="destructive"
              size="sm"
              className="h-6 text-xs"
              onClick={onRemove}
            >
              削除
            </Button>
          </div>
          
          <div className="text-xs mb-2">
            <p>緯度: {position[0].toFixed(4)}</p>
            <p>経度: {position[1].toFixed(4)}</p>
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
            <div className="bg-gray-50 p-2 rounded border max-h-[300px] overflow-y-auto">
              <LocationDescription description={description} />
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;
