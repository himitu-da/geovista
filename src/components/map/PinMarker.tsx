
import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationDescription from './LocationDescription';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language, t } = useLanguage();

  // Generate description
  const handleGenerateDescription = async () => {
    setLoading(true);
    try {
      const generatedDescription = await onGenerateDescription(position, language);
      setDescription(generatedDescription);
    } catch (error) {
      console.error('Failed to generate description:', error);
      setDescription(language === 'es' 
        ? 'Error al generar descripción. Por favor, inténtelo de nuevo.' 
        : 'Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <Popup className="location-popup">
        <div className="w-72 p-1 max-w-full">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
              {language === 'es' ? 'Ubicación Seleccionada' : 'Selected Location'}
            </h3>
            <Button 
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs mb-2 bg-gray-50 p-2 rounded">
            <div className="grid grid-cols-2 gap-1">
              <div>{language === 'es' ? 'Latitud' : 'Latitude'}: <span className="font-medium">{position[0].toFixed(4)}</span></div>
              <div>{language === 'es' ? 'Longitud' : 'Longitude'}: <span className="font-medium">{position[1].toFixed(4)}</span></div>
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
                  {language === 'es' ? 'Generando...' : 'Generating...'}
                </>
              ) : (
                language === 'es' ? 'Generar descripción del lugar' : 'Generate location description'
              )}
            </Button>
          ) : (
            <div className="bg-white p-2 rounded border max-h-[350px] overflow-y-auto">
              <LocationDescription description={description} />
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default PinMarker;
