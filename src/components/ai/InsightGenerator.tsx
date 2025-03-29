
import React from 'react';
import { CountryData, DataMetric } from '@/types/country';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightGeneratorProps {
  country: CountryData | undefined;
  metric: DataMetric;
  loading: boolean;
  insight: string;
  onGenerate: () => void;
}

const InsightGenerator: React.FC<InsightGeneratorProps> = ({
  country,
  loading,
  insight,
  onGenerate
}) => {
  return (
    <div>
      {!insight && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGenerate}
          disabled={loading || !country}
          className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-1.5 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin h-3 w-3 mr-1.5" /> 
              生成中...
            </span>
          ) : (
            <span className="flex items-center">
              <Sparkles className="h-3 w-3 mr-1.5" />
              インサイトを生成
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default InsightGenerator;
