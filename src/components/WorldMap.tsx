
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CountryData } from '@/types/country';
import { captureException } from '@/lib/sentry';

interface WorldMapProps {
  countries: CountryData[];
  loading: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ countries, loading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapKey, setMapKey] = useState<string>('');

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedMapKey = localStorage.getItem('mapbox_key');
    if (storedMapKey) {
      setMapKey(storedMapKey);
    }
  }, []);

  const handleKeySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      mapbox_key: { value: string };
    };
    const newKey = target.mapbox_key.value;
    localStorage.setItem('mapbox_key', newKey);
    setMapKey(newKey);
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapKey || !mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = mapKey;
      
      if (map.current) return; // Initialize map only once
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.5,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add event listener for when the map is loaded
      map.current.on('load', () => {
        console.log('Map loaded successfully');
      });
      
      // Cleanup function
      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (err) {
      captureException(err);
      console.error('Error initializing map:', err);
    }
  }, [mapKey]);

  // Add GeoJSON data to map when countries data is loaded
  useEffect(() => {
    if (!map.current || !mapKey || loading || countries.length === 0) return;
    
    try {
      // Wait for map to be loaded
      if (!map.current.isStyleLoaded()) {
        map.current.once('style.load', () => {
          addCountriesToMap();
        });
      } else {
        addCountriesToMap();
      }
    } catch (err) {
      captureException(err);
      console.error('Error adding countries to map:', err);
    }
    
    function addCountriesToMap() {
      if (!map.current) return;
      
      // Create a GeoJSON feature collection from the countries data
      const geojson = {
        type: 'FeatureCollection',
        features: countries.map(country => ({
          type: 'Feature',
          properties: {
            id: country.id,
            name: country.name,
            code: country.code,
            population: country.population,
            population_density: country.area_km2 ? (country.population / country.area_km2) : null
          },
          geometry: country.geometry.geometry
        }))
      };
      
      // Remove existing layers and sources if they exist
      if (map.current.getSource('countries')) {
        map.current.removeLayer('countries-fill');
        map.current.removeLayer('countries-line');
        map.current.removeSource('countries');
      }
      
      // Add the countries source
      map.current.addSource('countries', {
        type: 'geojson',
        data: geojson as any
      });
      
      // Add a fill layer
      map.current.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'population_density'],
            0, '#e2f1ff',
            10, '#c8e1ff',
            50, '#94c8ff',
            100, '#64a9ff',
            500, '#3485ed',
            1000, '#0061db'
          ],
          'fill-opacity': 0.8
        }
      });
      
      // Add a line layer
      map.current.addLayer({
        id: 'countries-line',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': '#627BC1',
          'line-width': 1
        }
      });
      
      // Add a popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      
      map.current.on('mouseenter', 'countries-fill', (e) => {
        if (!map.current || !e.features || e.features.length === 0) return;
        
        map.current.getCanvas().style.cursor = 'pointer';
        
        const feature = e.features[0];
        const props = feature.properties;
        
        const coordinates = e.lngLat;
        
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-lg">${props.name}</h3>
            <p>Population: ${props.population.toLocaleString()}</p>
            ${props.population_density ? 
              `<p>Density: ${props.population_density.toFixed(2)} people/km²</p>` : 
              ''}
          </div>
        `;
        
        popup.setLngLat(coordinates).setHTML(popupContent).addTo(map.current);
      });
      
      map.current.on('mouseleave', 'countries-fill', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    }
  }, [countries, loading, mapKey]);

  if (!mapKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Mapbox API Key Required</h2>
          <p className="mb-4">
            Please enter your Mapbox public access token to load the map. 
            You can get one from <a href="https://account.mapbox.com/access-tokens/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Mapbox</a>.
          </p>
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="mapbox_key" className="block mb-1 font-medium">
                Mapbox Public Token
              </label>
              <input
                type="text"
                id="mapbox_key"
                name="mapbox_key"
                className="w-full p-2 border rounded"
                placeholder="Enter your Mapbox public token"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save & Load Map
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-blue-500 font-medium">Loading map data...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default WorldMap;
