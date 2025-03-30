// src/components/map/LocationSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Clock, Users, Camera, Book } from 'lucide-react';

type SectionType = 'geography' | 'history' | 'culture' | 'attractions' | 'overview';

interface LocationSectionProps {
  type: SectionType;
  title: string;
  content: string;
  delay?: number;
}

/**
 * Renders a styled section of the location description with appropriate icons and theming
 */
const LocationSection: React.FC<LocationSectionProps> = ({ 
  type, 
  title, 
  content,
  delay = 0
}) => {
  // Get section styling based on type
  const getSectionStyles = (): {
    icon: JSX.Element;
    bgColor: string;
    borderColor: string;
    headingColor: string;
  } => {
    switch (type) {
      case 'geography':
        return {
          icon: <Map className="w-4 h-4" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          headingColor: 'text-blue-700'
        };
      case 'history':
        return {
          icon: <Clock className="w-4 h-4" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          headingColor: 'text-amber-700'
        };
      case 'culture':
        return {
          icon: <Users className="w-4 h-4" />,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          headingColor: 'text-purple-700'
        };
      case 'attractions':
        return {
          icon: <Camera className="w-4 h-4" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          headingColor: 'text-green-700'
        };
      default:
        return {
          icon: <Book className="w-4 h-4" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          headingColor: 'text-gray-700'
        };
    }
  };

  const { icon, bgColor, borderColor, headingColor } = getSectionStyles();

  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Section header */}
      <div className={`rounded-t-lg border ${borderColor} border-b-0 shadow-sm`}>
        <h2 className={`text-sm font-semibold py-2 px-3 flex items-center gap-2 ${bgColor} ${headingColor}`}>
          <span className={`rounded-full p-1 ${bgColor}`}>
            {icon}
          </span>
          {title}
        </h2>
      </div>

      {/* Section content */}
      <div className="bg-white px-3 py-2.5 border border-gray-100 rounded-b-lg shadow-sm">
        <p className="leading-relaxed text-gray-700 text-xs">
          {content}
        </p>
      </div>
    </motion.div>
  );
};

export default LocationSection;