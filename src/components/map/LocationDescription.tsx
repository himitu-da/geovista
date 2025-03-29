
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
    color: string; 
    bgColor: string; 
    borderColor: string;
    headingColor: string;
  } => {
    const lowerText = text.toLowerCase();
    
    // 英語の見出しキーワード
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
    // スペイン語の見出しキーワード
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
    // 日本語の見出しキーワード
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
    
    // デフォルト値
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
                <h1 className="text-sm font-bold text-blue-600 border-b pb-1.5 mb-2 flex items-center" {...props}>
                  <Star className="w-4 h-4 mr-1.5 text-blue-500" />
                  {children}
                </h1>
                <div className="bg-blue-50 p-2 rounded-md border border-blue-100 shadow-sm">
                  <p className="text-xs text-blue-800 italic">
                    {language === 'es'
                      ? 'Descripción de lugar generada por IA. La exactitud no está garantizada.'
                      : language === 'ja'
                      ? 'AI生成の場所の説明です。正確性は保証されていません。'
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
