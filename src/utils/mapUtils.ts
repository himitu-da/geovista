
import { DataMetric } from '@/types/country';
import { captureException } from '@/lib/sentry';

// Get color based on metric value
export const getColorForValue = (value: number | null, metric: DataMetric): string => {
  if (value === null) return '#e2f1ff'; // Default light color for null values
  
  if (metric === 'population_density') {
    if (value < 10) return '#e2f1ff';
    if (value < 50) return '#c8e1ff';
    if (value < 100) return '#94c8ff';
    if (value < 500) return '#64a9ff';
    if (value < 1000) return '#3485ed';
    return '#0061db';
  } 
  else if (metric === 'population') {
    if (value < 1000000) return '#e2f1ff';
    if (value < 10000000) return '#c8e1ff';
    if (value < 50000000) return '#94c8ff';
    if (value < 100000000) return '#64a9ff';
    if (value < 500000000) return '#3485ed';
    return '#0061db';
  }
  else if (metric === 'gdp_per_capita') {
    if (value < 1000) return '#e2f1ff';
    if (value < 5000) return '#c8e1ff';
    if (value < 15000) return '#94c8ff';
    if (value < 30000) return '#64a9ff';
    if (value < 50000) return '#3485ed';
    return '#0061db';
  }
  
  // Default fallback
  return '#e2f1ff';
};

// Get color stops for the legend
export const getColorStops = (metric: DataMetric): { value: number; color: string }[] => {
  if (metric === 'population_density') {
    return [
      { value: 0, color: '#e2f1ff' },
      { value: 10, color: '#c8e1ff' },
      { value: 50, color: '#94c8ff' },
      { value: 100, color: '#64a9ff' },
      { value: 500, color: '#3485ed' },
      { value: 1000, color: '#0061db' }
    ];
  } 
  else if (metric === 'population') {
    return [
      { value: 0, color: '#e2f1ff' },
      { value: 1000000, color: '#c8e1ff' },
      { value: 10000000, color: '#94c8ff' },
      { value: 50000000, color: '#64a9ff' },
      { value: 100000000, color: '#3485ed' },
      { value: 500000000, color: '#0061db' }
    ];
  }
  else if (metric === 'gdp_per_capita') {
    return [
      { value: 0, color: '#e2f1ff' },
      { value: 1000, color: '#c8e1ff' },
      { value: 5000, color: '#94c8ff' },
      { value: 15000, color: '#64a9ff' },
      { value: 30000, color: '#3485ed' },
      { value: 50000, color: '#0061db' }
    ];
  }
  
  // Default fallback
  return [
    { value: 0, color: '#e2f1ff' },
    { value: 10, color: '#c8e1ff' },
    { value: 50, color: '#94c8ff' },
    { value: 100, color: '#64a9ff' },
    { value: 500, color: '#3485ed' },
    { value: 1000, color: '#0061db' }
  ];
};
