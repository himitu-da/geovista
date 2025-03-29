// src/components/map/PinMarker.tsx
import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, MapPin, MapPinOff, Check, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationDescription from './LocationDescription';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { generateSpeech } from '@/utils/speechUtils';
import AudioPlayer from './AudioPlayer';
import { useToast } from '@/hooks/use-toast';

interface PinMarkerProps {
  position: [number, number];
  onRemove: () => void;
  onGenerateDescription: (position: [number, number], language: string) => Promise<string>;
}

// Custom pin icon
const customPinIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

/**
 * Pin marker component
 */
const PinMarker: React.FC<PinMarkerProps> = ({ position, onRemove, onGenerateDescription }) => {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);
  const [speechLoading, setSpeechLoading] = useState<boolean>(false);
  const [speechData, setSpeechData] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // ログ出力用
    console.log("PinMarker mounted at position:", position);
    
    return () => {
      console.log("PinMarker unmounted from position:", position);
    };
  }, [position]);

  // Generate location description
  const handleGenerateDescription = async () => {
    setLoading(true);
    console.log("Generating description for location:", position);
    
    try {
      const generatedDescription = await onGenerateDescription(position, language);
      console.log("Description received, length:", generatedDescription?.length || 0);
      setDescription(generatedDescription);
      
      // Show success toast
      toast({
        title: language === 'es' ? 'Descripción generada' : 'Description generated',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to generate description:', error);
      setDescription(t('errorGeneratingDescription'));
      
      // Show error toast
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: t('errorGeneratingDescription'),
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate speech for text-to-speech functionality
  const handleGenerateSpeech = async () => {
    if (!description || speechLoading) return;
    
    setSpeechLoading(true);
    console.log("Generating speech for description, length:", description.length);
    
    try {
      // 独自の音声生成関数を呼び出す
      const audio = await generateSpeech(description, language);
      
      if (!audio) {
        throw new Error("No audio data received");
      }
      
      console.log("Speech generated successfully, data length:", audio.length);
      setSpeechData(audio);
      
      // Show success toast
      toast({
        title: language === 'es' ? 'Audio generado' : 'Audio generated',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to generate speech:', error);
      
      // Show error toast
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'Error al generar audio. Por favor, inténtelo de nuevo.' 
          : 'Failed to generate audio. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setSpeechLoading(false);
    }
  };

  // 独立した音声読み上げボタン
  const renderTextToSpeechButton = () => {
    if (!description) return null;

    return (
      <div className="flex justify-center mb-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 py-1 text-xs flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={handleGenerateSpeech}
          disabled={speechLoading}
        >
          {speechLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t('generating')}</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5" />
              <span>{t('listen')}</span>
            </>
          )}
        </Button>
      </div>
    );
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
      <Popup 
        className="location-popup" 
        autoPan={true} 
        minWidth={300} 
        maxWidth={350}
        keepInView={true}
      >
        <motion.div 
          className="p-3 max-w-full"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
              {t('selectedLocation')}
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
              {t('remove')}
            </Button>
          </div>
          
          {/* Coordinates display */}
          <div className="text-xs mb-3 bg-gray-50 p-2 rounded-md border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>{t('latitude')}: 
                <span className="font-medium ml-1">{position[0].toFixed(4)}</span>
              </div>
              <div>{t('longitude')}: 
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
                  {t('generating')}
                </>
              ) : (
                <>
                  <Check className="mr-1.5 h-3 w-3" />
                  {t('generateDescription')}
                </>
              )}
            </Button>
          ) : (
            <motion.div 
              className="bg-white rounded-md border border-gray-200 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* 独立した音声再生ボタン（追加） */}
              {renderTextToSpeechButton()}
              
              {/* Location description */}
              <div className="max-h-[400px] overflow-y-auto">
                <LocationDescription 
                  description={description}
                  onTextToSpeech={handleGenerateSpeech}
                  speechLoading={speechLoading}
                />
              </div>
              
              {/* Audio player - render only when speech data is available */}
              {speechData && (
                <div className="p-3 border-t">
                  <AudioPlayer 
                    audioBase64={speechData}
                    onEnded={() => console.log("Audio playback ended")}
                  />
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;