
import { CountryData, DataMetric } from '@/types/country';

/**
 * メトリック表示の書式設定
 */
export const formatMetricValue = (country: CountryData, metric: DataMetric): string => {
  switch (metric) {
    case 'population_density':
      return country.area_km2 
        ? `${(country.population / country.area_km2).toFixed(1)} 人/km²` 
        : 'N/A';
    case 'population':
      return country.population.toLocaleString() + ' 人';
    case 'gdp_per_capita':
      return country.gdp_per_capita 
        ? `$${country.gdp_per_capita.toLocaleString()}` 
        : 'N/A';
    default:
      return 'N/A';
  }
};

/**
 * 値をフォーマットする関数（CountryTableRowで使用）
 */
export const formatValue = (value: number | null, metric: string): string => {
  if (value === null) return 'N/A';
  
  switch (metric) {
    case 'population_density':
      return `${value.toFixed(1)} 人/km²`;
    case 'population':
      return value.toLocaleString() + ' 人';
    case 'gdp_per_capita':
      return `$${value.toLocaleString()}`;
    default:
      return value.toString();
  }
};
