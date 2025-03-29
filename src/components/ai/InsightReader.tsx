
import React from 'react';
import { Headphones, PauseCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language } = useLanguage();
  
  if (!insight) return null;
  
  return (
    <ButtonAnimation>
      <button
        onClick={onTogglePlay}
        className="flex items-center text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1.5 px-3 rounded-full transition-colors"
      >
        {isPlaying ? (
          <>
            <PauseCircle className="h-3.5 w-3.5 mr-1.5" />
            {language === 'es' ? 'Pausar' : 'Pause'}
          </>
        ) : (
          <>
            <Headphones className="h-3.5 w-3.5 mr-1.5" />
            {language === 'es' ? 'Escuchar' : 'Listen'}
          </>
        )}
      </button>
    </ButtonAnimation>
  );
};

export default InsightReader;
