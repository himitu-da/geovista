
import React, { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import PinMarker from './PinMarker';
import { generateLocationDescription } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

/**
 * Map pin manager component
 * Manages the addition and removal of pins on the map
 */
const MapPinManager: React.FC = () => {
  const [pins, setPins] = useState<[number, number][]>([]);
  const [pendingPin, setPendingPin] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  // Map event listener
  const map = useMapEvents({
    // Handle right-click for desktop
    contextmenu: (e) => {
      // デスクトップの右クリックでピン追加確認ダイアログを表示
      setPendingPin([e.latlng.lat, e.latlng.lng]);
    },
    // Handle tap/click for mobile
    click: (e) => {
      if (isMobile) {
        // モバイルのタップでピン追加確認ダイアログを表示
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

      {/* ピン追加確認ダイアログ */}
      <AlertDialog open={pendingPin !== null} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'es' ? 'Añadir un pin' : 'Add a pin'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'es' 
                ? '¿Desea añadir un pin en esta ubicación?' 
                : 'Do you want to add a pin at this location?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddPin}>
              {language === 'es' ? 'Añadir' : 'Add'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MapPinManager;
