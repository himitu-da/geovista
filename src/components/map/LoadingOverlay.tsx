
import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-[1000]"
    >
      <motion.div 
        className="flex flex-col items-center"
        animate={{ scale: [0.95, 1, 0.95] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
        <p className="text-apple-gray-600 font-medium tracking-tight">地図データを読み込み中...</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
