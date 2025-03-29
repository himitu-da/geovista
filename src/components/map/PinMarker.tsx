// src/components/map/PinMarker.tsx
import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, MapPin, MapPinOff, Check, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationDescription from './LocationDescription';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { generateSpeech, isTextTooLongForSpeech } from '@/utils/speechUtils';
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
 * Pin marker component with enhanced error handling
 */
const PinMarker: React.FC<PinMarkerProps> = ({ position, onRemove, onGenerateDescription }) => {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);
  const [speechLoading, setSpeechLoading] = useState<boolean>(false);
  const [speechData, setSpeechData] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    console.log("PinMarker mounted at position:", position);
    return () => {
      console.log("PinMarker unmounted from position:", position);
    };
  }, [position]);

  /**
   * Generate location description
   */
  const handleGenerateDescription = async () => {
    setLoading(true);
    setSpeechError(null);
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

  /**
   * Generate speech for text-to-speech functionality with enhanced error handling
   */
  const handleGenerateSpeech = async () => {
    if (!description || speechLoading) return;
    
    // Reset previous speech errors
    setSpeechError(null);
    setSpeechLoading(true);
    
    // Check if text is too long for the API
    if (isTextTooLongForSpeech(description)) {
      console.log("Text too long, truncating for speech generation");
      toast({
        title: language === 'es' ? 'Texto demasiado largo' : 'Text too long',
        description: language === 'es' 
          ? 'El texto será recortado para la generación de voz.' 
          : 'The text will be truncated for voice generation.',
        duration: 3000,
      });
    }
    
    console.log("Generating speech for description, length:", description.length);
    
    try {
      // Attempt to generate speech with retry mechanism
      let audio = null;
      let retryCount = 0;
      const maxRetries = 1;
      
      while (!audio && retryCount <= maxRetries) {
        try {
          audio = await generateSpeech(description, language);
          if (!audio && retryCount < maxRetries) {
            console.log(`Speech generation attempt ${retryCount + 1} failed, retrying...`);
            retryCount++;
            // Small delay before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (err) {
          console.error(`Speech generation attempt ${retryCount + 1} error:`, err);
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw err;
          }
        }
      }
      
      if (!audio) {
        throw new Error("Speech generation failed after retries");
      }
      
      console.log("Speech generated successfully, data length:", audio.length);
      setSpeechData(audio);
      setSpeechError(null);
      
      // Show success toast
      toast({
        title: language === 'es' ? 'Audio generado' : 'Audio generated',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to generate speech:', error);
      setSpeechError(t('errorGeneratingSpeech'));
      
      // Show error toast
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: t('errorGeneratingSpeech'),
        variant: 'destructive',
        duration: 3000,
      });
      
      // Check and report specific errors for debugging
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Speech generation error details:', errorMessage);
    } finally {
      setSpeechLoading(false);
    }
  };

  /**
   * Render text-to-speech button (single source of truth)
   */
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
              {/* Text-to-speech button - SINGLE SOURCE OF TRUTH */}
              {renderTextToSpeechButton()}
              
              {/* Speech generation error */}
              {speechError && (
                <div className="mx-3 mb-3 p-2 text-xs text-red-600 bg-red-50 rounded-md border border-red-200 flex items-center">
                  <span className="text-xs">{speechError}</span>
                </div>
              )}
              
              {/* Location description */}
              <div className="max-h-[400px] overflow-y-auto">
                <LocationDescription description={description} />
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