
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Map, Clock, Home, Camera } from 'lucide-react';

interface LocationDescriptionProps {
  description: string;
}

/**
 * 場所の説明を美しく表示するコンポーネント
 */
const LocationDescription: React.FC<LocationDescriptionProps> = ({ description }) => {
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
            <h1 className="text-sm font-bold mb-2 text-blue-600" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xs font-semibold mt-2 mb-1 flex items-center" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-1.5 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-1.5 pl-4 list-disc" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-0.5" {...props} />
          ),
        }}
      >
        {description}
      </ReactMarkdown>
    </motion.div>
  );
};

export default LocationDescription;
