// src/components/map/PinMarker.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

// Import our modular components
import LocationHeader from './LocationHeader';
import CoordinatesDisplay from './CoordinatesDisplay';
import LocationDescription from './LocationDescription';
import DescriptionControls from './DescriptionControls';
import AudioPlayer from './AudioPlayer';
import { 
  generateSpeech, 
  generateFallbackSpeech, 
  SpeechErrorType 
} from '@/utils/speechUtils';

interface PinMarkerProps {
  position: [number, number];
  onRemove: () => void;
  onGenerateDescription: (position: [number, number], language: string) => Promise<string>;
  pinIndex: number; // Added pinIndex prop
}

// Get custom pin icon based on index
const getCustomPinIcon = (index: number) => {
  // Colors for different pin indices (up to 10 colors, then repeat)
  const colors = [
    'red', 'blue', 'green', 'orange', 'purple', 
    'darkred', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple'
  ];
  
  const color = colors[index % colors.length];
  
  return new L.Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

/**
 * Improved PinMarker component with better separation of concerns
 * Now includes pin index for identification and custom colors
 * Added better error handling for speech generation
 */
const PinMarker: React.FC<PinMarkerProps> = ({ 
  position, 
  onRemove, 
  onGenerateDescription,
  pinIndex 
}) => {
  // State management
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);
  const [speechLoading, setSpeechLoading] = useState<boolean>(false);
  const [speechData, setSpeechData] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [useFallbackSpeech, setUseFallbackSpeech] = useState<boolean>(false);
  
  // Refs
  const popupRef = useRef<L.Popup>(null);
  const retryCountRef = useRef<number>(0);
  
  // Hooks
  const { language, t } = useLanguage();
  const { toast } = useToast();

  // Get custom icon for this pin
  const pinIcon = getCustomPinIcon(pinIndex);

  /**
   * Generate location description with error handling
   */
  const handleGenerateDescription = async () => {
    setLoading(true);
    setDescriptionError(null);
    
    try {
      const generatedDescription = await onGenerateDescription(position, language);
      
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
      setDescriptionError(t('errorGeneratingDescription'));
      
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
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate speech audio with improved error handling and fallback options
   */
  const handleGenerateSpeech = async () => {
    if (!description || speechLoading) return;
    
    setSpeechLoading(true);
    setSpeechError(null);
    setUseFallbackSpeech(false);
    
    try {
      if (useFallbackSpeech) {
        // Use browser's built-in speech synthesis as fallback
        await generateFallbackSpeech(description, language);
        setSpeechError(null);
        toast({
          title: language === 'es' ? 'Usando síntesis de voz del navegador' : 'Using browser speech synthesis',
          duration: 2000,
        });
      } else {
        // Try ElevenLabs first
        const audio = await generateSpeech(description, language);
        
        if (!audio) {
          throw new Error("No audio data received");
        }
        
        setSpeechData(audio);
        setSpeechError(null);
        
        toast({
          title: language === 'es' ? 'Audio generado' : 'Audio generated',
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error('Failed to generate speech:', error);
      
      // Check if it's a timeout error
      if (error?.type === SpeechErrorType.TIMEOUT) {
        setSpeechError(t('elevenlabsDisabled'));
        
        // Offer to use the fallback
        toast({
          title: language === 'es' ? 'Error de tiempo de espera' : 'Timeout Error',
          description: language === 'es' 
            ? 'El servicio de voz está tardando demasiado. ¿Quieres usar la voz del navegador en su lugar?' 
            : 'Voice service is taking too long. Want to use browser voice instead?',
          variant: 'destructive',
          duration: 5000,
          action: (
            <button 
              onClick={() => {
                setUseFallbackSpeech(true);
                handleGenerateSpeech();
              }}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow text-xs"
            >
              {language === 'es' ? 'Usar voz del navegador' : 'Use browser voice'}
            </button>
          ),
        });
      } else {
        setSpeechError(t('errorGeneratingSpeech'));
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: t('errorGeneratingSpeech'),
          variant: 'destructive',
          duration: 3000,
        });
      }
    } finally {
      setSpeechLoading(false);
    }
  };

  // Toggle to browser's speech synthesis fallback
  const toggleFallbackSpeech = () => {
    setUseFallbackSpeech(prevState => !prevState);
    setSpeechError(null);
    toast({
      title: useFallbackSpeech 
        ? (language === 'es' ? 'Usando ElevenLabs' : 'Using ElevenLabs') 
        : (language === 'es' ? 'Usando síntesis de voz del navegador' : 'Using browser speech synthesis'),
      duration: 2000,
    });
  };

  return (
    <Marker 
      position={position} 
      icon={pinIcon}
      eventHandlers={{
        popupopen: () => setIsPopupOpen(true),
        popupclose: () => setIsPopupOpen(false),
      }}
    >
      {/* Show pin index in tooltip */}
      <Tooltip 
        permanent={true} 
        direction="top" 
        offset={[0, -20]} 
        className="pin-index-tooltip"
      >
        <div className="text-xs font-bold bg-white px-1 rounded-sm border shadow-sm">
          {pinIndex + 1}
        </div>
      </Tooltip>

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header with location and remove button */}
          <LocationHeader onRemove={onRemove} pinIndex={pinIndex} />
          
          {/* Coordinates display */}
          <CoordinatesDisplay position={position} className="mb-3" />
          
          {/* Description controls */}
          <DescriptionControls
            loading={loading}
            hasDescription={!!description}
            speechLoading={speechLoading}
            onGenerateDescription={handleGenerateDescription}
            onGenerateSpeech={handleGenerateSpeech}
          />
          
          {/* Description content */}
          {description && (
            <motion.div 
              className="bg-white rounded-md border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-h-[400px] overflow-y-auto">
                <LocationDescription description={description} />
              </div>
              
              {/* Audio player when speech is available */}
              {speechData && !useFallbackSpeech && (
                <div className="p-3 border-t">
                  <AudioPlayer 
                    audioBase64={speechData}
                    onEnded={() => console.log("Audio playback ended")}
                  />
                </div>
              )}
              
              {/* Speech error message with fallback option */}
              {speechError && (
                <div className="p-3 border-t">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-red-500">{speechError}</p>
                    {speechError === t('elevenlabsDisabled') && (
                      <button 
                        onClick={toggleFallbackSpeech}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1.5 px-3 rounded-full transition-colors"
                      >
                        {language === 'es' ? 'Usar voz del navegador' : 'Use browser voice'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Description error message */}
          {descriptionError && (
            <div className="mt-2">
              <p className="text-xs text-red-500">{descriptionError}</p>
            </div>
          )}
        </motion.div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;