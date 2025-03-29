
import React from 'react';
import { Popup } from 'react-leaflet';

interface MapPopupProps {
  position: [number, number];
  content: string;
  isOpen: boolean;
}

/**
 * マップ上のポップアップコンポーネント - 改善版
 */
const MapPopup: React.FC<MapPopupProps> = ({ position, content, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <Popup
      position={position}
      className="country-popup map-tooltip"
      closeButton={false}
      autoPan={false}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Popup>
  );
};

export default MapPopup;
