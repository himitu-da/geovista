
import React, { useEffect } from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import { CountryData, DataMetric } from '@/types/country';
import { getColorForValue } from '@/utils/mapUtils';
import { captureException } from '@/lib/sentry';
import L from 'leaflet';
import { motion } from 'framer-motion';

interface MapDataHandlerProps {
  countries: CountryData[];
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}

const MapDataHandler: React.FC<MapDataHandlerProps> = ({
  countries,
  selectedMetric,
  selectedCountry,
  onCountrySelect
}) => {
  const map = useMap();
  const [popupInfo, setPopupInfo] = React.useState<{
    position: [number, number];
    content: string;
    isOpen: boolean;
  } | null>(null);
  
  // Effect to handle zooming to the selected country
  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.id === selectedCountry);
      
      if (country && country.geometry && country.geometry.geometry) {
        try {
          // Create a GeoJSON object
          const geoJSON = L.geoJSON(country.geometry.geometry as any);
          
          // Get bounds and fit map to these bounds
          const bounds = geoJSON.getBounds();
          map.flyToBounds(bounds, { 
            padding: [50, 50], 
            maxZoom: 5, 
            duration: 1, 
            easeLinearity: 0.25
          });
        } catch (error) {
          console.error('Error fitting bounds:', error);
        }
      }
    }
  }, [selectedCountry, countries, map]);
  
  // Style function for GeoJSON features
  const styleFeature = (feature: any) => {
    const countryId = feature.properties.id;
    const isSelected = countryId === selectedCountry;
    
    let value: number | null = null;
    
    if (selectedMetric === 'population_density') {
      const population = feature.properties.population || 0;
      const area = feature.properties.area_km2;
      value = area ? population / area : null;
    } else if (selectedMetric === 'population') {
      value = feature.properties.population;
    } else if (selectedMetric === 'gdp_per_capita') {
      value = feature.properties.gdp_per_capita || 0;
    }
    
    return {
      fillColor: getColorForValue(value, selectedMetric),
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#0071e3' : '#86868b',
      fillOpacity: isSelected ? 0.85 : (selectedCountry ? 0.45 : 0.75),
      dashArray: isSelected ? '' : '2'
    };
  };
  
  // Handle feature click
  const onFeatureClick = (event: any) => {
    const layer = event.target;
    const feature = layer.feature;
    const countryId = feature.properties.id;
    
    // Animate click
    map.getContainer().style.cursor = 'pointer';
    
    // Toggle selection
    if (countryId === selectedCountry) {
      onCountrySelect(null);
      map.flyTo([20, 0], 2, { duration: 1 });
    } else {
      onCountrySelect(countryId);
    }
  };
  
  // Handle mouseover
  const onFeatureMouseover = (event: any) => {
    const layer = event.target;
    const feature = layer.feature;
    const props = feature.properties;
    
    map.getContainer().style.cursor = 'pointer';
    
    let valueToShow = '';
    let formattedValue = '';
    
    if (selectedMetric === 'population_density' && props.area_km2) {
      const density = props.population / props.area_km2;
      valueToShow = `人口密度`;
      formattedValue = `${density.toFixed(1)} 人/km²`;
    } else if (selectedMetric === 'gdp_per_capita' && props.gdp_per_capita) {
      valueToShow = `一人当たりGDP`;
      formattedValue = `$${Number(props.gdp_per_capita).toLocaleString()}`;
    } else {
      valueToShow = `人口`;
      formattedValue = `${Number(props.population).toLocaleString()} 人`;
    }
    
    const bounds = layer.getBounds();
    const center = bounds.getCenter();
    
    setPopupInfo({
      position: [center.lat, center.lng],
      content: `
        <div class="py-1 px-2">
          <h3 class="font-medium text-sm text-gray-900">${props.name}</h3>
          <p class="text-xs text-gray-700">${valueToShow}: <span class="font-medium">${formattedValue}</span></p>
        </div>
      `,
      isOpen: true
    });
    
    layer.setStyle({
      weight: 2,
      fillOpacity: 0.85,
      dashArray: ''
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };
  
  // Handle mouseout
  const onFeatureMouseout = (event: any) => {
    const layer = event.target;
    
    map.getContainer().style.cursor = '';
    setPopupInfo(prev => prev ? { ...prev, isOpen: false } : null);
    
    // Reset style unless it's the selected country
    if (layer.feature.properties.id !== selectedCountry) {
      layer.setStyle({
        weight: 1,
        fillOpacity: selectedCountry ? 0.45 : 0.75,
        dashArray: '2'
      });
    }
  };
  
  // Transform countries data to GeoJSON
  const countryGeoJson = React.useMemo(() => {
    if (!countries || countries.length === 0) return null;
    
    try {
      return {
        type: 'FeatureCollection',
        features: countries.map(country => {
          return {
            type: 'Feature',
            properties: {
              id: country.id,
              name: country.name,
              code: country.code,
              population: country.population,
              area_km2: country.area_km2,
              gdp_per_capita: country.gdp_per_capita || 0
            },
            geometry: country.geometry.geometry
          };
        })
      };
    } catch (err) {
      captureException(err);
      console.error('Error creating GeoJSON:', err);
      return null;
    }
  }, [countries]);
  
  return (
    <>
      {countryGeoJson && (
        <GeoJSON
          data={countryGeoJson as any}
          style={styleFeature}
          onEachFeature={(feature, layer) => {
            layer.on({
              mouseover: onFeatureMouseover,
              mouseout: onFeatureMouseout,
              click: onFeatureClick
            });
          }}
        />
      )}
      
      {popupInfo && popupInfo.isOpen && (
        <Popup
          position={popupInfo.position}
          className="country-popup map-tooltip"
        >
          <div dangerouslySetInnerHTML={{ __html: popupInfo.content }} />
        </Popup>
      )}
    </>
  );
};

export default MapDataHandler;
