
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
 * 場所の説明を構造化して表示するコンポーネント
 */
const LocationDescription: React.FC<LocationDescriptionProps> = ({ description }) => {
  const { language } = useLanguage();
  
  // セクションタイプに基づいてアイコンと色のスタイル情報を決定する関数
  const getSectionInfo = (text: string): { 
    icon: JSX.Element; 
    borderColor: string; 
    bgColor: string;
    headingColor: string;
    iconColor: string;
  } => {
    const lowerText = text.toLowerCase();
    
    // 英語の見出しキーワード
    if (lowerText.includes('geography')) 
      return { 
        icon: <Map className="w-4 h-4" />, 
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50',
        headingColor: 'text-blue-700',
        iconColor: 'text-blue-500'
      };
    if (lowerText.includes('history')) 
      return { 
        icon: <Clock className="w-4 h-4" />, 
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-50',
        headingColor: 'text-amber-700',
        iconColor: 'text-amber-500'
      };
    if (lowerText.includes('culture')) 
      return { 
        icon: <Users className="w-4 h-4" />, 
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-50',
        headingColor: 'text-purple-700',
        iconColor: 'text-purple-500'
      };
    if (lowerText.includes('points of interest') || lowerText.includes('attractions')) 
      return { 
        icon: <Camera className="w-4 h-4" />, 
        borderColor: 'border-emerald-500',
        bgColor: 'bg-emerald-50',
        headingColor: 'text-emerald-700',
        iconColor: 'text-emerald-500'
      };
    if (lowerText.includes('overview')) 
      return { 
        icon: <Book className="w-4 h-4" />, 
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-50',
        headingColor: 'text-gray-700',
        iconColor: 'text-gray-500'
      };
    
    // スペイン語の見出しキーワード
    if (lowerText.includes('geografía')) 
      return { 
        icon: <Map className="w-4 h-4" />, 
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50',
        headingColor: 'text-blue-700',
        iconColor: 'text-blue-500'
      };
    if (lowerText.includes('historia')) 
      return { 
        icon: <Clock className="w-4 h-4" />, 
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-50',
        headingColor: 'text-amber-700',
        iconColor: 'text-amber-500'
      };
    if (lowerText.includes('cultura')) 
      return { 
        icon: <Users className="w-4 h-4" />, 
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-50',
        headingColor: 'text-purple-700',
        iconColor: 'text-purple-500'
      };
    if (lowerText.includes('puntos de interés') || lowerText.includes('atracciones')) 
      return { 
        icon: <Camera className="w-4 h-4" />, 
        borderColor: 'border-emerald-500',
        bgColor: 'bg-emerald-50',
        headingColor: 'text-emerald-700',
        iconColor: 'text-emerald-500'
      };
    if (lowerText.includes('resumen')) 
      return { 
        icon: <Book className="w-4 h-4" />, 
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-50',
        headingColor: 'text-gray-700',
        iconColor: 'text-gray-500'
      };
    
    // デフォルト値
    return { 
      icon: <MapPin className="w-4 h-4" />, 
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      headingColor: 'text-red-700',
      iconColor: 'text-red-500'
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-xs location-description space-y-4"
    >
      <ReactMarkdown
        components={{
          h1: ({ node, children, ...props }) => {
            return (
              <div className="mb-4">
                <div className="bg-blue-50 p-3 rounded-t-lg border-l-4 border-blue-500 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-500" />
                  <h1 className="text-sm font-bold text-blue-700" {...props}>
                    {children}
                  </h1>
                </div>
                <div className="bg-white p-3 rounded-b-lg border border-t-0 border-blue-100 shadow-sm">
                  <p className="text-xs text-blue-800 italic">
                    {language === 'es'
                      ? 'Descripción de lugar generada por IA. La exactitud no está garantizada.'
                      : 'AI-generated location description. Accuracy not guaranteed.'}
                  </p>
                </div>
              </div>
            );
          },
          h2: ({ node, children, ...props }) => {
            // 見出しテキストを取得し、適切なアイコンとスタイルを選択
            const headingText = children ? children.toString() : '';
            const { icon, borderColor, bgColor, headingColor, iconColor } = getSectionInfo(headingText);
            
            return (
              <div className="mb-4 location-section">
                <div className={cn("section-heading px-3 py-2 rounded-t-lg border-l-4", borderColor, bgColor, "flex items-center")} {...props}>
                  <span className={cn("mr-2", iconColor)}>
                    {icon}
                  </span>
                  <h2 className={cn("text-sm font-semibold", headingColor)}>
                    {children}
                  </h2>
                </div>
              </div>
            );
          },
          p: ({ node, children, ...props }) => {
            // 前の見出しのスタイル情報を取得するロジック
            // 実際の実装ではこれは難しいので、親要素のcontextを使うか、
            // ReactMarkdownの処理プロセスをカスタマイズする必要があります
            // ここではシンプルな実装にします
            
            return (
              <div className="bg-white px-3 py-2 rounded-b-lg border border-t-0 border-gray-200 shadow-sm mb-4">
                <p className="leading-relaxed text-gray-700 text-xs" {...props}>
                  {children}
                </p>
              </div>
            );
          },
          ul: ({ node, children, ...props }) => (
            <div className="bg-white px-3 py-2 rounded-b-lg border border-t-0 border-gray-200 shadow-sm mb-4">
              <ul className="space-y-1 list-none" {...props}>
                {children}
              </ul>
            </div>
          ),
          li: ({ node, children, ...props }) => (
            <li className="flex items-start text-gray-700 text-xs" {...props}>
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
