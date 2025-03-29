
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
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LocationDescriptionProps {
  description: string;
}

/**
 * 場所の説明を構造化して表示するコンポーネント（改良版）
 */
const LocationDescription: React.FC<LocationDescriptionProps> = ({ description }) => {
  const { language } = useLanguage();
  
  // セクションタイプに基づいてアイコンと色を決定する関数
  const getSectionInfo = (text: string): { icon: JSX.Element; color: string; bgColor: string } => {
    const lowerText = text.toLowerCase();
    
    // 英語の見出しキーワード
    if (lowerText.includes('geography')) 
      return { 
        icon: <Map className="w-4 h-4 mr-1.5" />, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50'
      };
    if (lowerText.includes('history')) 
      return { 
        icon: <Clock className="w-4 h-4 mr-1.5" />, 
        color: 'text-amber-600', 
        bgColor: 'bg-amber-50'
      };
    if (lowerText.includes('culture')) 
      return { 
        icon: <Users className="w-4 h-4 mr-1.5" />, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50'
      };
    if (lowerText.includes('points of interest') || lowerText.includes('attractions')) 
      return { 
        icon: <Camera className="w-4 h-4 mr-1.5" />, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50'
      };
    if (lowerText.includes('overview')) 
      return { 
        icon: <Book className="w-4 h-4 mr-1.5" />, 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-50'
      };
    
    // スペイン語の見出しキーワード
    if (lowerText.includes('geografía')) 
      return { 
        icon: <Map className="w-4 h-4 mr-1.5" />, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50'
      };
    if (lowerText.includes('historia')) 
      return { 
        icon: <Clock className="w-4 h-4 mr-1.5" />, 
        color: 'text-amber-600', 
        bgColor: 'bg-amber-50'
      };
    if (lowerText.includes('cultura')) 
      return { 
        icon: <Users className="w-4 h-4 mr-1.5" />, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50'
      };
    if (lowerText.includes('puntos de interés') || lowerText.includes('atracciones')) 
      return { 
        icon: <Camera className="w-4 h-4 mr-1.5" />, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50'
      };
    if (lowerText.includes('resumen')) 
      return { 
        icon: <Book className="w-4 h-4 mr-1.5" />, 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-50'
      };
    
    // デフォルト値
    return { 
      icon: <MapPin className="w-4 h-4 mr-1.5" />, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50'
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
                <h1 className="text-sm font-bold text-blue-600 border-b pb-1.5 mb-2 flex items-center" {...props}>
                  <Star className="w-4 h-4 mr-1.5 text-blue-500" />
                  {children}
                </h1>
                <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
                  <p className="text-xs text-blue-800 italic">
                    {language === 'ja' 
                      ? 'AI生成による場所の説明です。正確性は保証されません。'
                      : language === 'es'
                        ? 'Descripción de lugar generada por IA. La exactitud no está garantizada.'
                        : 'AI-generated location description. Accuracy not guaranteed.'}
                  </p>
                </div>
              </div>
            );
          },
          h2: ({ node, children, ...props }) => {
            // 見出しテキストを取得し、適切なアイコンを選択
            const headingText = children ? children.toString() : '';
            const { icon, color, bgColor } = getSectionInfo(headingText);
            
            return (
              <div className={cn("mt-4 mb-2 rounded-t-md", bgColor)} {...props}>
                <h2 className={cn("text-sm font-semibold py-2 px-3 flex items-center", color)}>
                  {icon}
                  {children}
                </h2>
              </div>
            );
          },
          p: ({ node, children, ...props }) => {
            return (
              <p className="mb-3 leading-relaxed text-gray-700 px-3 py-2 text-xs bg-white rounded-b-md shadow-sm" {...props}>
                {children}
              </p>
            );
          },
          ul: ({ node, ...props }) => (
            <ul className="mb-3 px-3 py-2 list-none space-y-1 bg-white rounded-b-md shadow-sm" {...props} />
          ),
          li: ({ node, children, ...props }) => (
            <li className="mb-1 text-gray-700 flex items-start" {...props}>
              <span className="inline-block mr-1.5 mt-0.5 text-green-500">•</span>
              <span>{children}</span>
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
