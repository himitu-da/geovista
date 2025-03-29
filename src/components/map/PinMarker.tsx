// src/components/map/PinMarker.tsx
import React, { useState, useEffect, useRef } from 'react';
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
 * Pin marker component with error handling and fallbacks
 */
const PinMarker: React.FC<PinMarkerProps> = ({ position, onRemove, onGenerateDescription }) => {
  // State management
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);
  const [speechLoading, setSpeechLoading] = useState<boolean>(false);
  const [speechData, setSpeechData] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  
  // Refs
  const popupRef = useRef<L.Popup>(null);
  const retryCountRef = useRef<number>(0);
  
  // Hooks
  const { language, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    console.log("PinMarker mounted at position:", position);
    
    return () => {
      console.log("PinMarker unmounted from position:", position);
    };
  }, [position]);

  /**
   * Generate location description with retry logic
   */
  const handleGenerateDescription = async () => {
    setLoading(true);
    setDescriptionError(null);
    console.log("Generating description for location:", position);
    
    try {
      const generatedDescription = await onGenerateDescription(position, language);
      console.log("Description received, length:", generatedDescription?.length || 0);
      
      if (!generatedDescription || generatedDescription.trim() === '') {
        throw new Error('Empty description received');
      }
      
      setDescription(generatedDescription);
      setDescriptionError(null);
      
      // Show success toast
      toast({
        title: language === 'es' ? 'Descripción generada' : 'Description generated',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to generate description:', error);
      
      // Set error message based on retry count
      setDescriptionError(t('errorGeneratingDescription'));
      
      // Show error toast
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: t('errorGeneratingDescription'),
        variant: 'destructive',
        duration: 3000,
      });
      
      // If we haven't exceeded retry limit, try again after delay
      if (retryCountRef.current < 2) {
        retryCountRef.current += 1;
        setTimeout(() => {
          handleGenerateDescription();
        }, 2000); // Retry after 2 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate speech with improved error handling
   */
  const handleGenerateSpeech = async () => {
    if (!description || speechLoading) return;
    
    setSpeechLoading(true);
    setSpeechError(null);
    console.log("Generating speech for description, length:", description.length);
    
    try {
      // Generate speech with improved error handling
      const audio = await generateSpeech(description, language);
      
      if (!audio) {
        throw new Error("No audio data received");
      }
      
      console.log("Speech generated successfully");
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
    } finally {
      setSpeechLoading(false);
    }
  };

  // Text-to-speech button component
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
        ref={popupRef}
      >
        <motion.div 
          className="p-3 max-w-full"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header with location and remove button */}
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
          
          {/* Description or generate button */}
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
              {/* Speech button */}
              {renderTextToSpeechButton()}
              
              {/* Description content */}
                <div className="max-h-[400px] overflow-y-auto">
                <LocationDescription 
                  description={description}
                />
                </div>
              
              {/* Audio player when speech is available */}
              {speechData && (
                <div className="p-3 border-t">
                  <AudioPlayer 
                    audioBase64={speechData}
                    onEnded={() => console.log("Audio playback ended")}
                  />
                </div>
              )}
              
              {/* Speech error message */}
              {speechError && (
                <div className="p-3 border-t">
                  <p className="text-xs text-red-500">
                    {speechError}
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Description error message */}
          {descriptionError && (
            <div className="mt-2">
              <p className="text-xs text-red-500">
                {descriptionError}
              </p>
            </div>
          )}
        </motion.div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;