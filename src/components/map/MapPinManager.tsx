
import React, { useState } from 'react';
import { useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import PinMarker from './PinMarker';
import { generateLocationDescription } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MapPin, MousePointer2, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

// 半透明なピンアイコンを作成
const ghostPinIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'ghost-pin-icon opacity-70'
});

/**
 * ピン追加の説明ツールチップコンポーネント - MapPinManager内に統合
 */
const PinInstructionTooltip = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // 翻訳テキストを取得
  const tooltipText = t('addPin');

  // デバイスに適したアイコンを使用
  const IconComponent = isMobile ? Smartphone : MousePointer2;

  // アニメーションバリアント
  const tooltipVariants = {
    initial: { 
      opacity: 0,
      y: 10,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    highlight: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 1px 2px rgba(0,0,0,0.1)",
        "0 4px 8px rgba(0,0,0,0.15)",
        "0 1px 2px rgba(0,0,0,0.1)"
      ],
      transition: {
        duration: 1.2,
        times: [0, 0.5, 1],
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="fixed z-[500] left-4 bottom-4 px-3 py-2 rounded-lg bg-white/90 shadow-md border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 dark:text-gray-200"
      initial="initial"
      animate={["visible", "highlight"]}
      variants={tooltipVariants}
    >
      <div className="flex items-center gap-2 text-sm">
        <IconComponent className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span>{tooltipText}</span>
      </div>
    </motion.div>
  );
};

/**
 * Map pin manager component
 * 半透明のピンとポップアップを表示して、UXを改善したバージョン
 */
const MapPinManager: React.FC = () => {
  const [pins, setPins] = useState<[number, number][]>([]);
  const [pendingPin, setPendingPin] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  // Map event listener - タップ/クリックで即座にピンを追加
  const map = useMapEvents({
    click: (e) => {
      // Removeボタンのクリックイベントを防止するための小さな遅延
      setTimeout(() => {
        // クリック位置の要素を確認
        const element = document.elementFromPoint(e.originalEvent.clientX, e.originalEvent.clientY);
        const isRemoveButton = element?.closest('button')?.textContent?.includes('Remove');
        
        if (!isRemoveButton) {
          const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
          addPin(newPosition[0], newPosition[1]);
        }
      }, 10);
    }
  });

  // ピンを追加
  const addPin = (lat: number, lng: number) => {
    setPins(prev => [...prev, [lat, lng]]);
    
    toast({
      title: language === 'es' ? 'Pin añadido' : 'Pin added',
      description: language === 'es' 
        ? `Latitud: ${lat.toFixed(4)}, Longitud: ${lng.toFixed(4)}`
        : `Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`,
      duration: 2000,
    });
  };

  // ピンを削除
  const handleRemovePin = (index: number) => {
    setPins(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: language === 'es' ? 'Pin eliminado' : 'Pin removed',
      duration: 2000,
    });
  };

  // ロケーション説明を生成
  const handleGenerateDescription = async (position: [number, number], lang: string): Promise<string> => {
    try {
      const description = await generateLocationDescription(position, lang);
      return description;
    } catch (error) {
      console.error('Error generating description:', error);
      return language === 'es' 
        ? 'Error al generar la descripción.' 
        : 'Failed to generate description.';
    }
  };

  return (
    <>
      {/* 既存のピン */}
      {pins.map((position, index) => (
        <PinMarker
          key={`pin-${index}-${position[0]}-${position[1]}`}
          position={position}
          onRemove={() => handleRemovePin(index)}
          onGenerateDescription={handleGenerateDescription}
        />
      ))}

      {/* ピン追加の説明ツールチップ */}
      <PinInstructionTooltip />
    </>
  );
};

export default MapPinManager;
