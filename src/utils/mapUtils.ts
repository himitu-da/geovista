
import { DataMetric } from '@/types/country';
import { captureException } from '@/lib/sentry';

// Get color based on metric value
export const getColorForValue = (value: number | null, metric: DataMetric): string => {
  if (value === null) return '#f5f5f7'; // Apple-like light gray for null values
  
  if (metric === 'population_density') {
    if (value < 10) return '#f5f5f7';
    if (value < 50) return '#d2d2d7';
    if (value < 100) return '#a1a1a6';
    if (value < 500) return '#6e6e73';
    if (value < 1000) return '#3a3a3c';
    return '#1d1d1f';
  } 
  else if (metric === 'population') {
    if (value < 1000000) return '#f5f5f7';
    if (value < 10000000) return '#d2d2d7';
    if (value < 50000000) return '#a1a1a6';
    if (value < 100000000) return '#6e6e73';
    if (value < 500000000) return '#3a3a3c';
    return '#1d1d1f';
  }
  else if (metric === 'gdp_per_capita') {
    if (value < 1000) return '#f5f5f7';
    if (value < 5000) return '#d2d2d7';
    if (value < 15000) return '#a1a1a6';
    if (value < 30000) return '#6e6e73';
    if (value < 50000) return '#3a3a3c';
    return '#1d1d1f';
  }
  
  // Default fallback
  return '#f5f5f7';
};

// Get color stops for the legend
export const getColorStops = (metric: DataMetric): { value: number; color: string }[] => {
  if (metric === 'population_density') {
    return [
      { value: 0, color: '#f5f5f7' },
      { value: 10, color: '#d2d2d7' },
      { value: 50, color: '#a1a1a6' },
      { value: 100, color: '#6e6e73' },
      { value: 500, color: '#3a3a3c' },
      { value: 1000, color: '#1d1d1f' }
    ];
  } 
  else if (metric === 'population') {
    return [
      { value: 0, color: '#f5f5f7' },
      { value: 1000000, color: '#d2d2d7' },
      { value: 10000000, color: '#a1a1a6' },
      { value: 50000000, color: '#6e6e73' },
      { value: 100000000, color: '#3a3a3c' },
      { value: 500000000, color: '#1d1d1f' }
    ];
  }
  else if (metric === 'gdp_per_capita') {
    return [
      { value: 0, color: '#f5f5f7' },
      { value: 1000, color: '#d2d2d7' },
      { value: 5000, color: '#a1a1a6' },
      { value: 15000, color: '#6e6e73' },
      { value: 30000, color: '#3a3a3c' },
      { value: 50000, color: '#1d1d1f' }
    ];
  }
  
  // Default fallback
  return [
    { value: 0, color: '#f5f5f7' },
    { value: 10, color: '#d2d2d7' },
    { value: 50, color: '#a1a1a6' },
    { value: 100, color: '#6e6e73' },
    { value: 500, color: '#3a3a3c' },
    { value: 1000, color: '#1d1d1f' }
  ];
};
