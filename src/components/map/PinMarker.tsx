
import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, MapPin, MapPinOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationDescription from './LocationDescription';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface PinMarkerProps {
  position: [number, number];
  onRemove: () => void;
  onGenerateDescription: (position: [number, number], language: string) => Promise<string>;
}

// カスタムピンアイコン
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
  const { language, t } = useLanguage();

  // 説明文を生成する
  const handleGenerateDescription = async () => {
    setLoading(true);
    try {
      const generatedDescription = await onGenerateDescription(position, language);
      setDescription(generatedDescription);
    } catch (error) {
      console.error('Failed to generate description:', error);
      if (language === 'es') {
        setDescription('Error al generar descripción. Por favor, inténtelo de nuevo.');
      } else if (language === 'ja') {
        setDescription('説明の生成に失敗しました。もう一度お試しください。');
      } else {
        setDescription('Failed to generate description. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 言語に基づいてUIテキストを取得
  const getUiText = () => {
    if (language === 'es') {
      return {
        selectedLocation: 'Ubicación Seleccionada',
        remove: 'Eliminar',
        latitude: 'Latitud',
        longitude: 'Longitud',
        generating: 'Generando...',
        generateDescription: 'Generar descripción del lugar'
      };
    } else if (language === 'ja') {
      return {
        selectedLocation: '選択した場所',
        remove: '削除',
        latitude: '緯度',
        longitude: '経度',
        generating: '生成中...',
        generateDescription: '場所の説明を生成'
      };
    } else {
      return {
        selectedLocation: 'Selected Location',
        remove: 'Remove',
        latitude: 'Latitude',
        longitude: 'Longitude',
        generating: 'Generating...',
        generateDescription: 'Generate location description'
      };
    }
  };

  const uiText = getUiText();

  return (
    <Marker 
      position={position} 
      icon={customPinIcon}
      eventHandlers={{
        popupopen: () => setIsPopupOpen(true),
        popupclose: () => setIsPopupOpen(false),
      }}
    >
      <Popup className="location-popup" autoPan={true} minWidth={300} maxWidth={350}>
        <motion.div 
          className="p-3 max-w-full"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
              {uiText.selectedLocation}
            </h3>
            <Button 
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 py-0 flex items-center gap-1 text-xs hover:bg-red-50 hover:text-red-600 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <MapPinOff className="h-3 w-3" />
              {uiText.remove}
            </Button>
          </div>
          
          <div className="text-xs mb-3 bg-gray-50 p-2 rounded-md border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>{uiText.latitude}: 
                <span className="font-medium ml-1">{position[0].toFixed(4)}</span>
              </div>
              <div>{uiText.longitude}: 
                <span className="font-medium ml-1">{position[1].toFixed(4)}</span>
              </div>
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
                  {uiText.generating}
                </>
              ) : (
                <>
                  <Check className="mr-1.5 h-3 w-3" />
                  {uiText.generateDescription}
                </>
              )}
            </Button>
          ) : (
            <motion.div 
              className="bg-white rounded-md border border-gray-200 max-h-[400px] overflow-y-auto shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LocationDescription description={description} />
            </motion.div>
          )}
        </motion.div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;
