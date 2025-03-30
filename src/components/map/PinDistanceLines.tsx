// src/components/map/PinDistanceLines.tsx
import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { useLanguage } from '@/contexts/LanguageContext';

interface PinDistanceLinesProps {
  pins: [number, number][];
  distances: {
    fromPin: number;
    toPin: number;
    distance: number;
    bearing: number;
  }[];
}

/**
 * Component that displays lines between pins with distance tooltips
 * Improved with thicker lines and better hover detection
 * Fixed focus rectangle issue
 */
const PinDistanceLines: React.FC<PinDistanceLinesProps> = ({ 
  pins, 
  distances 
}) => {
  const { language } = useLanguage();
  
  if (!distances.length) return null;
  
  // Format distance based on length (m vs km)
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  // Prevent focus rectangle by preventing default click behavior
  const preventFocus = (e: any) => {
    if (e && e.originalEvent) {
      e.originalEvent.preventDefault();
    }
  };
  
  return (
    <>
      {distances.map((item, index) => {
        const fromPin = pins[item.fromPin];
        const toPin = pins[item.toPin];
        
        // Skip if we don't have both pins
        if (!fromPin || !toPin) return null;
        
        return (
          <React.Fragment key={`line-${index}`}>
            {/* Main visible line */}
            <Polyline
              positions={[fromPin, toPin]}
              pathOptions={{
                color: '#3b82f6',
                weight: 3,
                opacity: 0.8,
                dashArray: '5, 5',
                className: 'pin-connection-line',
                // Disable interactive on the visible line
                interactive: false
              }}
            />
            
            {/* Invisible wider line for easier hover detection */}
            <Polyline
              positions={[fromPin, toPin]}
              pathOptions={{
                color: 'transparent',
                weight: 15,
                opacity: 0,
                interactive: true,
                bubblingMouseEvents: false // Prevent event bubbling
              }}
              eventHandlers={{
                click: preventFocus, // Prevent focus on click
                mousedown: preventFocus, // Prevent focus on mousedown
                mouseup: preventFocus, // Prevent focus on mouseup
              }}
            >
              <Tooltip 
                sticky={true}
                className="distance-tooltip"
                opacity={0.95}
              >
                <div className="text-xs font-medium px-1 py-0.5">
                  {language === 'es' ? 'Distancia' : 'Distance'}: {formatDistance(item.distance)}
                </div>
              </Tooltip>
            </Polyline>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default PinDistanceLines;