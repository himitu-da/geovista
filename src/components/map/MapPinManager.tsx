
import React, { useState, useEffect } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import PinMarker from './PinMarker';
import { generateLocationDescription } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MapPin, X, MousePointer2, Smartphone } from 'lucide-react';
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
const PinInstructionTooltip: React.FC = () => {
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
      className="fixed z-[500] left-4 bottom-4 px-3 py-2 rounded-lg bg-white/90 shadow-md border border-gray-200"
      initial="initial"
      animate={["visible", "highlight"]}
      variants={tooltipVariants}
    >
      <div className="flex items-center gap-2 text-sm text-gray-700">
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
  const isMobile = useIsMobile();

  // Map event listener
  const map = useMapEvents({
    // Handle right-click for desktop
    contextmenu: (e) => {
      // デスクトップの右クリックで半透明ピンを表示
      setPendingPin([e.latlng.lat, e.latlng.lng]);
    },
    // Handle tap/click for mobile
    click: (e) => {
      if (isMobile) {
        // モバイルのタップで半透明ピンを表示
        setPendingPin([e.latlng.lat, e.latlng.lng]);
      }
    }
  });

  // Common function to add a pin
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

  // Remove pin
  const handleRemovePin = (index: number) => {
    setPins(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: language === 'es' ? 'Pin eliminado' : 'Pin removed',
      duration: 2000,
    });
  };

  // Generate location description
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

  // 確認ダイアログが閉じられたときのハンドラー
  const handleDialogClose = () => {
    setPendingPin(null);
  };

  // ピン追加の確認
  const handleConfirmAddPin = () => {
    if (pendingPin) {
      addPin(pendingPin[0], pendingPin[1]);
      setPendingPin(null);
    }
  };

  // クリックイベントを停止する（ポップアップの背景クリック防止）
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
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

      {/* 半透明の仮ピンとポップアップ */}
      {pendingPin && (
        <Marker 
          position={pendingPin} 
          icon={ghostPinIcon}
          zIndexOffset={1000}
        >
          <Popup
            className="pin-confirmation-popup"
            closeButton={false}
            autoPan={false}
            autoClose={false}
            closeOnClick={false}
            eventHandlers={{
              popupclose: handleDialogClose
            }}
          >
            <div 
              className="w-48 p-2" 
              onClick={stopPropagation}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                  {t('confirmAddPin')}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={handleDialogClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 justify-end mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleDialogClose}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleConfirmAddPin}
                >
                  {t('add')}
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* 左下の説明ツールチップを表示 */}
      <PinInstructionTooltip />
    </>
  );
};

export default MapPinManager;
