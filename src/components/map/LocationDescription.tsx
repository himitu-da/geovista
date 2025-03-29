
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Map, Clock, Home, Camera, Book, Users, MapPin } from 'lucide-react';

interface LocationDescriptionProps {
  description: string;
}

/**
 * 場所の説明を美しく表示するコンポーネント
 */
const LocationDescription: React.FC<LocationDescriptionProps> = ({ description }) => {
  // 見出しタイプに基づいてアイコンを選択する関数
  const getHeadingIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('地理')) return <Map className="w-4 h-4 mr-1.5 text-blue-500" />;
    if (lowerText.includes('歴史')) return <Clock className="w-4 h-4 mr-1.5 text-amber-500" />;
    if (lowerText.includes('文化')) return <Users className="w-4 h-4 mr-1.5 text-purple-500" />;
    if (lowerText.includes('見どころ')) return <Camera className="w-4 h-4 mr-1.5 text-green-500" />;
    if (lowerText.includes('概要')) return <Book className="w-4 h-4 mr-1.5 text-gray-500" />;
    return <MapPin className="w-4 h-4 mr-1.5 text-red-500" />;
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
          h1: ({ node, ...props }) => (
            <h1 className="text-sm font-bold mb-2 text-blue-600 border-b pb-1.5" {...props} />
          ),
          h2: ({ node, children, ...props }) => {
            // 見出しテキストを取得して適切なアイコンを選択
            const headingText = children ? children.toString() : '';
            const icon = getHeadingIcon(headingText);
            
            return (
              <h2 className="text-xs font-semibold mt-3 mb-1.5 flex items-center text-gray-700" {...props}>
                {icon}
                {children}
              </h2>
            );
          },
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed text-gray-600 pl-5" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-2 pl-5 list-disc" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-gray-600" {...props} />
          ),
        }}
      >
        {description}
      </ReactMarkdown>
    </motion.div>
  );
};

export default LocationDescription;
