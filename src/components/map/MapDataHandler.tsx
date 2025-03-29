
import React from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import { CountryData, DataMetric } from '@/types/country';
import { getColorForValue } from '@/utils/mapUtils';
import { captureException } from '@/lib/sentry';
import L from 'leaflet';

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
      fillOpacity: isSelected ? 0.8 : (selectedCountry ? 0.4 : 0.65),
      dashArray: isSelected ? '' : '2'
    };
  };
  
  // Handle feature click
  const onFeatureClick = (event: any) => {
    const layer = event.target;
    const feature = layer.feature;
    const countryId = feature.properties.id;
    
    // Toggle selection
    if (countryId === selectedCountry) {
      onCountrySelect(null);
    } else {
      onCountrySelect(countryId);
    }
  };
  
  // Handle mouseover
  const onFeatureMouseover = (event: any) => {
    const layer = event.target;
    const feature = layer.feature;
    const props = feature.properties;
    
    let valueToShow = '';
    if (selectedMetric === 'population_density' && props.area_km2) {
      const density = props.population / props.area_km2;
      valueToShow = `Density: ${density.toFixed(2)} people/km²`;
    } else if (selectedMetric === 'gdp_per_capita' && props.gdp_per_capita) {
      valueToShow = `GDP Per Capita: $${Number(props.gdp_per_capita).toLocaleString()}`;
    } else {
      valueToShow = `Population: ${Number(props.population).toLocaleString()}`;
    }
    
    const bounds = layer.getBounds();
    const center = bounds.getCenter();
    
    setPopupInfo({
      position: [center.lat, center.lng],
      content: `
        <div class="py-2 px-3">
          <h3 class="font-medium text-base text-gray-900">${props.name}</h3>
          <p class="text-sm text-gray-600">${valueToShow}</p>
        </div>
      `,
      isOpen: true
    });
    
    layer.setStyle({
      weight: 2,
      fillOpacity: 0.8,
      dashArray: ''
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };
  
  // Handle mouseout
  const onFeatureMouseout = (event: any) => {
    const layer = event.target;
    
    setPopupInfo(prev => prev ? { ...prev, isOpen: false } : null);
    
    // Reset style unless it's the selected country
    if (layer.feature.properties.id !== selectedCountry) {
      layer.setStyle({
        weight: 1,
        fillOpacity: selectedCountry ? 0.4 : 0.65,
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
          className="country-popup"
        >
          <div dangerouslySetInnerHTML={{ __html: popupInfo.content }} />
        </Popup>
      )}
    </>
  );
};

export default MapDataHandler;
