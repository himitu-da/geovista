
import React from 'react';
import { DataMetric } from '@/types/country';
import { Map, BarChart3 } from 'lucide-react';

interface DataControlsProps {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
  onMetricChange: (metric: DataMetric) => void;
}

const DataControls: React.FC<DataControlsProps> = ({
  visualizationType,
  selectedMetric,
  onVisualizationTypeChange,
  onMetricChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">Data Controls</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visualization Type
          </label>
          <div className="flex space-x-2">
            <button 
              className={`flex items-center justify-center px-4 py-2 ${
                visualizationType === 'map' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
              } rounded-md font-medium text-sm hover:bg-blue-200 transition-colors`}
              onClick={() => onVisualizationTypeChange('map')}
            >
              <Map className="mr-2 h-4 w-4" />
              Map
            </button>
            <button 
              className={`flex items-center justify-center px-4 py-2 ${
                visualizationType === 'chart' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
              } rounded-md font-medium text-sm hover:bg-gray-200 transition-colors`}
              onClick={() => onVisualizationTypeChange('chart')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Chart
            </button>
          </div>
        </div>
        
        <div className="pt-4">
          <h3 className="font-medium mb-2 text-gray-700">Data Metrics</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="population-density"
                name="metric"
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300"
                checked={selectedMetric === 'population_density'}
                onChange={() => onMetricChange('population_density')}
              />
              <label htmlFor="population-density" className="ml-2 block text-sm text-gray-700">
                Population Density
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="total-population"
                name="metric"
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300"
                checked={selectedMetric === 'population'}
                onChange={() => onMetricChange('population')}
              />
              <label htmlFor="total-population" className="ml-2 block text-sm text-gray-700">
                Total Population
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="gdp-per-capita"
                name="metric"
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300"
                checked={selectedMetric === 'gdp_per_capita'}
                onChange={() => onMetricChange('gdp_per_capita')}
              />
              <label htmlFor="gdp-per-capita" className="ml-2 block text-sm text-gray-700">
                GDP Per Capita
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataControls;
