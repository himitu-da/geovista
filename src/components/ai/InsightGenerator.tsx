
import React from 'react';
import { CountryData, DataMetric } from '@/types/country';
import { Loader2 } from 'lucide-react';

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
        <button
          onClick={onGenerate}
          disabled={loading || !country}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin h-3 w-3 mr-1" /> 
              Generating...
            </span>
          ) : (
            'Generate Insights'
          )}
        </button>
      )}
    </div>
  );
};

export default InsightGenerator;
