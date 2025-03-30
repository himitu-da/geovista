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
import { generateSpeech } from '@/utils/speechUtils';

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
   * Generate speech audio
   */
  const handleGenerateSpeech = async () => {
    if (!description || speechLoading) return;
    
    setSpeechLoading(true);
    setSpeechError(null);
    
    try {
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
    } catch (error) {
      console.error('Failed to generate speech:', error);
      setSpeechError(t('errorGeneratingSpeech'));
      
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
                  <p className="text-xs text-red-500">{speechError}</p>
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