
import React, { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import PinMarker from './PinMarker';
import { generateLocationDescription } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';

/**
 * マップピンマネージャーコンポーネント
 * マップ上でのピンの追加・削除を管理
 */
const MapPinManager: React.FC = () => {
  const [pins, setPins] = useState<[number, number][]>([]);
  const { toast } = useToast();

  // マップイベントリスナー
  const map = useMapEvents({
    contextmenu: (e) => {
      // 右クリックでピンを追加
      const { lat, lng } = e.latlng;
      setPins(prev => [...prev, [lat, lng]]);
      
      toast({
        title: 'ピンを追加しました',
        description: `緯度: ${lat.toFixed(4)}, 経度: ${lng.toFixed(4)}`,
        duration: 2000,
      });
    },
  });

  // ピンの削除
  const handleRemovePin = (index: number) => {
    setPins(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: 'ピンを削除しました',
      duration: 2000,
    });
  };

  // 場所の説明を生成
  const handleGenerateDescription = async (position: [number, number]): Promise<string> => {
    try {
      const description = await generateLocationDescription(position);
      return description;
    } catch (error) {
      console.error('Error generating description:', error);
      return '説明の生成に失敗しました。';
    }
  };

  return (
    <>
      {pins.map((position, index) => (
        <PinMarker
          key={`pin-${index}-${position[0]}-${position[1]}`}
          position={position}
          onRemove={() => handleRemovePin(index)}
          onGenerateDescription={handleGenerateDescription}
        />
      ))}
    </>
  );
};

export default MapPinManager;
