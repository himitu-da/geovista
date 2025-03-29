
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataMetric, CountryData } from '@/types/country';

interface SidebarMetricsSectionProps {
  selectedMetric: DataMetric;
  onMetricChange: (metric: DataMetric) => void;
  selectedCountry: string | null;
  countries: CountryData[];
}

/**
 * データメトリクスの選択セクションコンポーネント
 * 表示するデータメトリクス（人口密度など）を選択し、選択された国の詳細も表示
 */
const SidebarMetricsSection: React.FC<SidebarMetricsSectionProps> = ({
  selectedMetric,
  onMetricChange,
  selectedCountry,
  countries
}) => {
  const { t } = useLanguage();
  
  // 選択された国のデータを取得
  const selectedCountryData = selectedCountry 
    ? countries.find(c => c.id === selectedCountry) 
    : null;
    
  return (
    <>
      <Card className="border-none shadow-none">
        <CardContent className="p-3">
          <div className="space-y-2.5">
            <MetricRadioOption
              id="population-density"
              metric="population_density"
              label={t('populationDensity')}
              selectedMetric={selectedMetric}
              onChange={onMetricChange}
            />
            <MetricRadioOption
              id="total-population"
              metric="population"
              label={t('totalPopulation')}
              selectedMetric={selectedMetric}
              onChange={onMetricChange}
            />
            <MetricRadioOption
              id="gdp-per-capita"
              metric="gdp_per_capita"
              label={t('gdpPerCapita')}
              selectedMetric={selectedMetric}
              onChange={onMetricChange}
            />
          </div>
        </CardContent>
      </Card>
      
      {selectedCountry && selectedCountryData && (
        <SelectedCountryInfo
          countryData={selectedCountryData}
        />
      )}
    </>
  );
};

// データメトリクスのラジオボタンオプションコンポーネント
interface MetricRadioOptionProps {
  id: string;
  metric: DataMetric;
  label: string;
  selectedMetric: DataMetric;
  onChange: (metric: DataMetric) => void;
}

const MetricRadioOption: React.FC<MetricRadioOptionProps> = ({
  id,
  metric,
  label,
  selectedMetric,
  onChange
}) => (
  <div className="flex items-center">
    <input
      id={id}
      name="metric"
      type="radio"
      className="h-4 w-4 text-apple-blue border-apple-gray-300 focus:ring-apple-blue focus:ring-offset-1"
      checked={selectedMetric === metric}
      onChange={() => onChange(metric)}
    />
    <label htmlFor={id} className="ml-2.5 block text-sm text-gray-800">
      {label}
    </label>
  </div>
);

// 選択された国の情報表示コンポーネント
interface SelectedCountryInfoProps {
  countryData: CountryData;
}

const SelectedCountryInfo: React.FC<SelectedCountryInfoProps> = ({ countryData }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="text-sm font-medium text-blue-800 mb-1">
        {t('selectedCountry')}: {countryData.name}
      </h3>
      <div className="text-xs text-blue-700">
        <p>{t('population')}: {countryData.population.toLocaleString()}</p>
        {countryData.area_km2 && (
          <p>{t('area')}: {countryData.area_km2.toLocaleString()} km²</p>
        )}
        {countryData.gdp_per_capita && (
          <p>{t('gdpPerCapita')}: ${countryData.gdp_per_capita.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default SidebarMetricsSection;
