// src/components/map/MapPinManager.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import PinMarker from './PinMarker';
import { generateLocationDescription } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MapPin, X, MousePointer2, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePinDistances } from '@/utils/geoUtils';
import PinDistanceLines from './PinDistanceLines';

// Semi-transparent pin icon for pending pins
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
 * Add pin instruction tooltip component
 */
const PinInstructionTooltip: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Get translation text
  const tooltipText = t('addPin');

  // Use appropriate icon based on device
  const IconComponent = isMobile ? Smartphone : MousePointer2;

  // Animation variants
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
 * Handles adding, removing, and displaying pins on the map
 * Now with distance calculation between pins
 */
const MapPinManager: React.FC = () => {
  // State for pins and UI
  const [pins, setPins] = useState<[number, number][]>([]);
  const [pendingPin, setPendingPin] = useState<[number, number] | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  
  // Hooks
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();

  // Calculate distances between pins (when more than one pin exists)
  const pinDistances = useMemo(() => {
    return calculatePinDistances(pins);
  }, [pins]);

  // Hide the instruction tooltip after adding the first pin
  useEffect(() => {
    if (pins.length > 0) {
      setShowTooltip(false);
    }
  }, [pins]);

  // Map event handler
  const map = useMapEvents({
    // Handle right-click for desktop
    contextmenu: (e) => {
      // Show semi-transparent pin on right-click
      setPendingPin([e.latlng.lat, e.latlng.lng]);
    },
    // Handle tap/click for mobile
    click: (e) => {
      if (isMobile) {
        // Show semi-transparent pin on tap (mobile)
        setPendingPin([e.latlng.lat, e.latlng.lng]);
      }
    }
  });

  // Add a pin to the map
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

  // Remove a pin from the map
  const handleRemovePin = (index: number) => {
    setPins(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: language === 'es' ? 'Pin eliminado' : 'Pin removed',
      duration: 2000,
    });
  };

  // Generate description for a location
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

  // Handle dialog close (cancel pending pin)
  const handleDialogClose = () => {
    setPendingPin(null);
  };

  // Confirm adding the pending pin
  const handleConfirmAddPin = () => {
    if (pendingPin) {
      addPin(pendingPin[0], pendingPin[1]);
      setPendingPin(null);
    }
  };

  // Stop event propagation (prevent clicks from bubbling through popups)
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Display lines between pins with distance information */}
      <PinDistanceLines 
        pins={pins} 
        distances={pinDistances}
      />
      
      {/* Existing pins */}
      {pins.map((position, index) => (
        <PinMarker
          key={`pin-${index}-${position[0]}-${position[1]}`}
          position={position}
          onRemove={() => handleRemovePin(index)}
          onGenerateDescription={handleGenerateDescription}
          pinIndex={index}
        />
      ))}

      {/* Semi-transparent pending pin with confirmation popup */}
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
            <motion.div 
              className="w-48 p-2" 
              onClick={stopPropagation}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
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
              
              <div className="bg-gray-50 p-1.5 rounded-md mb-2 text-[10px] text-gray-600">
                <div className="grid grid-cols-2 gap-0.5">
                  <div>{language === 'es' ? 'Lat' : 'Lat'}: <span className="font-medium">{pendingPin[0].toFixed(4)}</span></div>
                  <div>{language === 'es' ? 'Lon' : 'Lon'}: <span className="font-medium">{pendingPin[1].toFixed(4)}</span></div>
                </div>
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
                  className="h-7 px-2.5 text-xs flex items-center gap-1"
                  onClick={handleConfirmAddPin}
                >
                  <Check className="h-3.5 w-3.5" />
                  {t('add')}
                </Button>
              </div>
            </motion.div>
          </Popup>
        </Marker>
      )}

      {/* Instruction tooltip (only shown until first pin is added) */}
      <AnimatePresence>
        {showTooltip && <PinInstructionTooltip />}
      </AnimatePresence>
    </>
  );
};

export default MapPinManager;