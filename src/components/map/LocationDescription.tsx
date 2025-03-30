// src/components/map/LocationDescription.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Map, Clock, Users, Camera, Book } from 'lucide-react';

interface LocationDescriptionProps {
  description: string;
  className?: string;
}

/**
 * Simplified location description component that displays content in vertical boxes
 */
const LocationDescription: React.FC<LocationDescriptionProps> = ({ 
  description,
  className = ''
}) => {
  const { language } = useLanguage();
  
  // Parse the description and extract sections
  const sections = useMemo(() => {
    if (!description) return [];

    // Try to break up the content into titled sections
    const result: { type: string; title: string; content: string }[] = [];
    
    // Split by markdown headers
    const parts = description.split(/(?=# |## )/g);
    
    // Process each part
    parts.forEach(part => {
      const trimmedPart = part.trim();
      if (!trimmedPart) return;
      
      // Check if it's a main title (# Title) or a section (## Section)
      if (trimmedPart.startsWith('# ')) {
        const title = trimmedPart.replace(/^# /, '').split('\n')[0].trim();
        const content = trimmedPart.replace(/^# [^\n]+\n/, '').trim();
        
        result.push({
          type: 'title',
          title,
          content
        });
      } else if (trimmedPart.startsWith('## ')) {
        const title = trimmedPart.replace(/^## /, '').split('\n')[0].trim();
        const content = trimmedPart.replace(/^## [^\n]+\n/, '').trim();
        
        // Determine section type based on title keywords
        let type = 'overview';
        const lowerTitle = title.toLowerCase();
        
        if (language === 'es') {
          // Spanish section detection
          if (lowerTitle.includes('geografía')) type = 'geography';
          else if (lowerTitle.includes('historia')) type = 'history';
          else if (lowerTitle.includes('cultura')) type = 'culture';
          else if (lowerTitle.includes('interés') || lowerTitle.includes('atracciones')) type = 'attractions';
        } else {
          // English section detection
          if (lowerTitle.includes('geography')) type = 'geography';
          else if (lowerTitle.includes('history')) type = 'history';
          else if (lowerTitle.includes('culture')) type = 'culture';
          else if (lowerTitle.includes('interest') || lowerTitle.includes('attraction')) type = 'attractions';
        }
        
        result.push({ type, title, content });
      } else {
        // If there's text without a header, add it as an overview section
        result.push({
          type: 'overview',
          title: language === 'es' ? 'Información general' : 'Overview',
          content: trimmedPart
        });
      }
    });
    
    return result;
  }, [description, language]);

  if (!description) return null;

  return (
    <motion.div 
      className={`text-xs ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-h-[250px] overflow-y-auto pr-1">
        {sections.map((section, index) => (
          <LocationBox
            key={`section-${index}`}
            type={section.type}
            title={section.title}
            content={section.content}
            delay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Helper component for each location box
interface LocationBoxProps {
  type: string;
  title: string;
  content: string;
  delay?: number;
}

const LocationBox: React.FC<LocationBoxProps> = ({
  type,
  title,
  content,
  delay = 0
}) => {
  // Get icon and styles based on section type
  const getBoxStyles = () => {
    switch (type) {
      case 'geography':
        return {
          icon: <Map className="w-4 h-4" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600'
        };
      case 'history':
        return {
          icon: <Clock className="w-4 h-4" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600'
        };
      case 'culture':
        return {
          icon: <Users className="w-4 h-4" />,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600'
        };
      case 'attractions':
        return {
          icon: <Camera className="w-4 h-4" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600'
        };
      case 'title':
        return {
          icon: null,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          iconColor: 'text-gray-700'
        };
      default:
        return {
          icon: <Book className="w-4 h-4" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600'
        };
    }
  };

  const { icon, bgColor, borderColor, iconColor } = getBoxStyles();

  // Format content by replacing markdown with HTML
  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n\n/g, '<br/><br/>') // Paragraphs
    .replace(/\n/g, '<br/>'); // Line breaks

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`rounded-lg border ${borderColor} mb-3 overflow-hidden shadow-sm`}
    >
      {/* Header */}
      <div className={`px-3 py-2 ${bgColor} flex items-center gap-2`}>
        {icon && (
          <span className={`${iconColor}`}>
            {icon}
          </span>
        )}
        <h3 className="font-medium">{title}</h3>
      </div>
      
      {/* Content */}
      <div className="p-3 bg-white">
        <div 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </div>
    </motion.div>
  );
};

export default LocationDescription;