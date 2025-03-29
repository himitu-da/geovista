
import { DataMetric } from '@/types/country';
import mapboxgl from 'mapbox-gl';
import { captureException } from '@/lib/sentry';

// Get color expression based on metric
export const getColorExpression = (metric: DataMetric): mapboxgl.Expression => {
  if (metric === 'population_density') {
    return [
      'interpolate',
      ['linear'],
      ['get', 'population_density'],
      0, '#e2f1ff',
      10, '#c8e1ff',
      50, '#94c8ff',
      100, '#64a9ff',
      500, '#3485ed',
      1000, '#0061db'
    ] as mapboxgl.Expression;
  } 
  else if (metric === 'population') {
    return [
      'interpolate',
      ['linear'],
      ['get', 'population'],
      0, '#e2f1ff',
      1000000, '#c8e1ff',
      10000000, '#94c8ff',
      50000000, '#64a9ff',
      100000000, '#3485ed',
      500000000, '#0061db'
    ] as mapboxgl.Expression;
  }
  else if (metric === 'gdp_per_capita') {
    return [
      'interpolate',
      ['linear'],
      ['get', 'gdp_per_capita'],
      0, '#e2f1ff',
      1000, '#c8e1ff',
      5000, '#94c8ff',
      15000, '#64a9ff',
      30000, '#3485ed',
      50000, '#0061db'
    ] as mapboxgl.Expression;
  }
  
  // Default fallback
  return [
    'interpolate',
    ['linear'],
    ['get', 'population_density'],
    0, '#e2f1ff',
    10, '#c8e1ff',
    50, '#94c8ff',
    100, '#64a9ff',
    500, '#3485ed',
    1000, '#0061db'
  ] as mapboxgl.Expression;
};

// Initialize mapbox map
export const initializeMap = (
  container: HTMLDivElement,
  mapboxKey: string
): mapboxgl.Map | null => {
  try {
    mapboxgl.accessToken = mapboxKey;
    
    const map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add event listener for when the map is loaded
    map.on('load', () => {
      console.log('Map loaded successfully');
    });
    
    return map;
  } catch (err) {
    captureException(err);
    console.error('Error initializing map:', err);
    return null;
  }
};
