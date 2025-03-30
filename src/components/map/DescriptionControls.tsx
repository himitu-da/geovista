// src/components/map/DescriptionControls.tsx
import React from 'react';
import { Loader2, Volume2, Check, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface DescriptionControlsProps {
  loading: boolean;
  hasDescription: boolean;
  speechLoading: boolean;
  onGenerateDescription: () => void;
  onGenerateSpeech: () => void;
}

/**
 * Controls for generating and interacting with location descriptions
 * Improved with better loading indicators and feedback
 */
const DescriptionControls: React.FC<DescriptionControlsProps> = ({
  loading,
  hasDescription,
  speechLoading,
  onGenerateDescription,
  onGenerateSpeech
}) => {
  const { t } = useLanguage();

  // If no description yet, show the generate button
  if (!hasDescription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={onGenerateDescription}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <Check className="mr-1.5 h-3 w-3" />
              {t('generateDescription')}
            </>
          )}
        </Button>
      </motion.div>
    );
  }

  // If we have a description, show listen button
  return (
    <motion.div 
      className="flex justify-center mb-3"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3 py-1 text-xs flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={onGenerateSpeech}
        disabled={speechLoading}
      >
        {speechLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{t('generating')}</span>
          </>
        ) : (
          <>
            <Headphones className="h-3.5 w-3.5" />
            <span>{t('listen')}</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default DescriptionControls;