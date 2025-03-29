
import React from 'react';
import { Headphones, PauseCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightReaderProps {
  insight: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const InsightReader: React.FC<InsightReaderProps> = ({
  insight,
  isPlaying,
  onTogglePlay
}) => {
  if (!insight) return null;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onTogglePlay}
      className="flex items-center text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1.5 px-3 rounded-full transition-colors"
    >
      {isPlaying ? (
        <>
          <PauseCircle className="h-3.5 w-3.5 mr-1.5" />
          一時停止
        </>
      ) : (
        <>
          <Headphones className="h-3.5 w-3.5 mr-1.5" />
          読み上げ
        </>
      )}
    </motion.button>
  );
};

export default InsightReader;
