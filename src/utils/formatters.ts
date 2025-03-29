
import { CountryData, DataMetric } from '@/types/country';

/**
 * メトリック表示の書式設定
 */
export const formatMetricValue = (country: CountryData, metric: DataMetric) => {
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
