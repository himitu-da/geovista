
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { 
  Map, 
  Clock, 
  MapPin, 
  Camera, 
  Book, 
  Users, 
  Building, 
  Mountain, 
  Star,
  Volume2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LocationDescriptionProps {
  description: string;
  onTextToSpeech?: () => void;
  speechLoading?: boolean;
}

/**
 * Enhanced location description component that displays structured information
 * with visually appealing section-based card designs
 */
const LocationDescription: React.FC<LocationDescriptionProps> = ({ 
  description, 
  onTextToSpeech,
  speechLoading = false
}) => {
  const { language, t } = useLanguage();
  
  // Determine appropriate icon and color scheme based on section type
  const getSectionInfo = (text: string): { 
    icon: JSX.Element; 
    color: string; 
    bgColor: string; 
    borderColor: string;
    headingColor: string;
  } => {
    const lowerText = text.toLowerCase();
    
    // English section keywords
    if (language === 'en') {
      if (lowerText.includes('geography')) 
        return { 
          icon: <Map className="w-4 h-4" />, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          headingColor: 'text-blue-700'
        };
      if (lowerText.includes('history')) 
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          headingColor: 'text-amber-700'
        };
      if (lowerText.includes('culture')) 
        return { 
          icon: <Users className="w-4 h-4" />, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          headingColor: 'text-purple-700'
        };
      if (lowerText.includes('points of interest') || lowerText.includes('attractions')) 
        return { 
          icon: <Camera className="w-4 h-4" />, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          headingColor: 'text-green-700'
        };
      if (lowerText.includes('overview')) 
        return { 
          icon: <Book className="w-4 h-4" />, 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          headingColor: 'text-gray-700'
        };
    } 
    // Spanish section keywords
    else if (language === 'es') {
      if (lowerText.includes('geografía')) 
        return { 
          icon: <Map className="w-4 h-4" />, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          headingColor: 'text-blue-700'
        };
      if (lowerText.includes('historia')) 
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          headingColor: 'text-amber-700'
        };
      if (lowerText.includes('cultura')) 
        return { 
          icon: <Users className="w-4 h-4" />, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          headingColor: 'text-purple-700'
        };
      if (lowerText.includes('puntos de interés') || lowerText.includes('atracciones')) 
        return { 
          icon: <Camera className="w-4 h-4" />, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          headingColor: 'text-green-700'
        };
      if (lowerText.includes('resumen')) 
        return { 
          icon: <Book className="w-4 h-4" />, 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          headingColor: 'text-gray-700'
        };
    }
    // Japanese section keywords
    else if (language === 'ja') {
      if (lowerText.includes('地理')) 
        return { 
          icon: <Map className="w-4 h-4" />, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          headingColor: 'text-blue-700'
        };
      if (lowerText.includes('歴史')) 
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          headingColor: 'text-amber-700'
        };
      if (lowerText.includes('文化')) 
        return { 
          icon: <Users className="w-4 h-4" />, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          headingColor: 'text-purple-700'
        };
      if (lowerText.includes('見どころ') || lowerText.includes('観光')) 
        return { 
          icon: <Camera className="w-4 h-4" />, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          headingColor: 'text-green-700'
        };
      if (lowerText.includes('概要')) 
        return { 
          icon: <Book className="w-4 h-4" />, 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          headingColor: 'text-gray-700'
        };
    }
    
    // Default styling for unrecognized sections
    return { 
      icon: <MapPin className="w-4 h-4" />, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      headingColor: 'text-gray-700'
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-xs location-description"
    >
      <ReactMarkdown
        components={{
          h1: ({ node, children, ...props }) => {
            return (
              <div className="mb-3">
                <div className="text-sm font-bold text-blue-600 border-b pb-1.5 mb-2 flex items-center justify-between">
                  <h1 className="flex items-center" {...props}>
                    <Star className="w-4 h-4 mr-1.5 text-blue-500" />
                    {children}
                  </h1>
                  
                  {onTextToSpeech && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-1.5 py-0 text-xs flex items-center gap-1 text-blue-600"
                      onClick={onTextToSpeech}
                      disabled={speechLoading}
                      title={t('textToSpeech')}
                    >
                      {speechLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                      {speechLoading ? t('generating') : t('listen')}
                    </Button>
                  )}
                </div>
                <div className="bg-blue-50 p-2 rounded-md border border-blue-100 shadow-sm">
                  <p className="text-xs text-blue-800 italic">
                    {t('locationDescription')}
                  </p>
                </div>
              </div>
            );
          },
          h2: ({ node, children, ...props }) => {
            // Get the heading text and select appropriate styling
            const headingText = children ? children.toString() : '';
            const { icon, color, bgColor, borderColor, headingColor } = getSectionInfo(headingText);
            
            return (
              <div className="mt-4 mb-2" {...props}>
                <div className={cn(
                  "rounded-t-lg border", 
                  borderColor,
                  "border-b-0",
                  "shadow-sm"
                )}>
                  {/* Section heading with icon and colored background */}
                  <h2 className={cn(
                    "text-sm font-semibold py-2 px-3 flex items-center gap-2",
                    bgColor,
                    headingColor
                  )}>
                    <span className={cn("rounded-full p-1", bgColor, color)}>
                      {icon}
                    </span>
                    {children}
                  </h2>
                </div>
              </div>
            );
          },
          p: ({ node, children, ...props }) => {
            return (
              <div className={cn(
                "bg-white px-3 py-2.5 border",
                "border-gray-100",
                "rounded-b-lg mb-5",
                "shadow-sm",
              )}>
                <p className="leading-relaxed text-gray-700 text-xs" {...props}>
                  {children}
                </p>
              </div>
            );
          },
          ul: ({ node, ...props }) => (
            <div className={cn(
              "bg-white px-3 py-2 border mb-5 rounded-b-lg",
              "border-gray-100",
              "shadow-sm"
            )}>
              <ul className="mb-0 pl-3 list-none space-y-1.5" {...props} />
            </div>
          ),
          li: ({ node, children, ...props }) => (
            <li className="mb-0.5 text-gray-700 flex items-start" {...props}>
              <span className="inline-block mr-1.5 text-blue-500">•</span>
              <span className="text-xs">{children}</span>
            </li>
          ),
        }}
      >
        {description}
      </ReactMarkdown>
    </motion.div>
  );
};

export default LocationDescription;
