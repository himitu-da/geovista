
import React from 'react';
import { CountryData, DataMetric } from '@/types/country';
import { GenerateButton } from './GenerateButton';

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
        <GenerateButton 
          loading={loading} 
          disabled={!country} 
          onClick={onGenerate} 
        />
      )}
    </div>
  );
};

export default InsightGenerator;
