
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { CountryData, DataMetric } from '@/types/country';
import { getColorExpression } from '@/utils/mapUtils';
import { captureException } from '@/lib/sentry';

interface MapDataHandlerProps {
  map: mapboxgl.Map | null;
  countries: CountryData[];
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}

const MapDataHandler: React.FC<MapDataHandlerProps> = ({
  map,
  countries,
  selectedMetric,
  selectedCountry,
  onCountrySelect
}) => {
  React.useEffect(() => {
    if (!map || countries.length === 0) return;
    
    try {
      // Wait for map to be loaded
      if (!map.isStyleLoaded()) {
        map.once('style.load', () => {
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
      if (!map) return;
      
      // Create a GeoJSON feature collection from the countries data
      const geojson = {
        type: 'FeatureCollection',
        features: countries.map(country => {
          // Calculate population density if needed
          const population_density = country.area_km2 ? (country.population / country.area_km2) : null;
          
          return {
            type: 'Feature',
            properties: {
              id: country.id,
              name: country.name,
              code: country.code,
              population: country.population,
              population_density: population_density,
              gdp_per_capita: country.gdp_per_capita || 0,
              selected: country.id === selectedCountry
            },
            geometry: country.geometry.geometry
          };
        })
      };
      
      // Remove existing layers and sources if they exist
      if (map.getSource('countries')) {
        map.removeLayer('countries-fill');
        map.removeLayer('countries-line');
        map.removeLayer('countries-selected');
        map.removeSource('countries');
      }
      
      // Add the countries source
      map.addSource('countries', {
        type: 'geojson',
        data: geojson as any
      });
      
      // Add a fill layer
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': getColorExpression(selectedMetric),
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'selected'], false],
            1,
            ['boolean', ['to-boolean', selectedCountry], false],
            0.5,
            0.8
          ]
        }
      });
      
      // Add a highlighting layer for selected country
      map.addLayer({
        id: 'countries-selected',
        type: 'fill',
        source: 'countries',
        filter: ['==', 'selected', true],
        paint: {
          'fill-color': getColorExpression(selectedMetric),
          'fill-outline-color': '#000000',
          'fill-opacity': 1
        }
      });
      
      // Add a line layer
      map.addLayer({
        id: 'countries-line',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': '#627BC1',
          'line-width': [
            'case',
            ['boolean', ['get', 'selected'], false],
            2,
            1
          ]
        }
      });
      
      addCountryLayers(map, 'countries-fill');
    }
    
    function addCountryLayers(map: mapboxgl.Map, layerId: string) {
      if (!map) return;
      
      // Add a popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      
      map.on('mouseenter', layerId, (e) => {
        if (!map || !e.features || e.features.length === 0) return;
        
        map.getCanvas().style.cursor = 'pointer';
        
        const feature = e.features[0];
        const props = feature.properties;
        
        const coordinates = e.lngLat;
        
        let valueToShow = '';
        if (selectedMetric === 'population_density' && props.population_density) {
          valueToShow = `Density: ${Number(props.population_density).toFixed(2)} people/km²`;
        } else if (selectedMetric === 'gdp_per_capita' && props.gdp_per_capita) {
          valueToShow = `GDP Per Capita: $${Number(props.gdp_per_capita).toLocaleString()}`;
        } else {
          valueToShow = `Population: ${Number(props.population).toLocaleString()}`;
        }
        
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-lg">${props.name}</h3>
            <p>${valueToShow}</p>
          </div>
        `;
        
        popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
      });
      
      map.on('mouseleave', layerId, () => {
        if (!map) return;
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
      
      // Add click event for selecting a country
      map.on('click', layerId, (e) => {
        if (!map || !e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const props = feature.properties;
        
        // Toggle selection if already selected
        if (props.id === selectedCountry) {
          onCountrySelect(null);
        } else {
          onCountrySelect(props.id);
        }
      });
    }
    
    // Clean up event listeners when component unmounts
    return () => {
      if (!map) return;
      
      // The correct way to remove event listeners is to remove them by layer ID
      // rather than trying to pass the original handlers (which are no longer accessible)
      map.off('mouseenter', 'countries-fill');
      map.off('mouseleave', 'countries-fill');
      map.off('click', 'countries-fill');
    };
  }, [countries, map, selectedMetric, selectedCountry, onCountrySelect]);
  
  return null; // This is a logic-only component, no rendering
};

export default MapDataHandler;
