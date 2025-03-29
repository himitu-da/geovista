
import React, { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import PinMarker from './PinMarker';
import { generateLocationDescription } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Map pin manager component
 * Manages the addition and removal of pins on the map
 */
const MapPinManager: React.FC = () => {
  const [pins, setPins] = useState<[number, number][]>([]);
  const { toast } = useToast();
  const { language } = useLanguage();

  // Map event listener
  const map = useMapEvents({
    contextmenu: (e) => {
      // Add pin on right-click
      const { lat, lng } = e.latlng;
      setPins(prev => [...prev, [lat, lng]]);
      
      toast({
        title: language === 'es' ? 'Pin añadido' : 'Pin added',
        description: language === 'es' 
          ? `Latitud: ${lat.toFixed(4)}, Longitud: ${lng.toFixed(4)}`
          : `Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`,
        duration: 2000,
      });
    },
  });

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
