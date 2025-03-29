
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
    <div className="bg-white rounded-xl shadow-apple-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-gray-900 tracking-tight">Data Controls</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 tracking-tight">
            Visualization Type
          </label>
          <div className="flex p-1 bg-apple-gray-100 rounded-lg">
            <button 
              className={`flex items-center justify-center px-4 py-2.5 ${
                visualizationType === 'map' 
                  ? 'bg-white text-apple-gray-700 shadow-apple-sm'
                  : 'bg-transparent text-apple-gray-500'
              } rounded-md font-medium text-sm transition-all duration-200 flex-1`}
              onClick={() => onVisualizationTypeChange('map')}
            >
              <Map className="mr-2 h-4 w-4" />
              Map
            </button>
            <button 
              className={`flex items-center justify-center px-4 py-2.5 ${
                visualizationType === 'chart' 
                  ? 'bg-white text-apple-gray-700 shadow-apple-sm'
                  : 'bg-transparent text-apple-gray-500'
              } rounded-md font-medium text-sm transition-all duration-200 flex-1`}
              onClick={() => onVisualizationTypeChange('chart')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Chart
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 tracking-tight">Data Metrics</h3>
          <div className="space-y-2.5">
            <div className="flex items-center">
              <input
                id="population-density"
                name="metric"
                type="radio"
                className="h-4 w-4 text-apple-blue border-apple-gray-300 focus:ring-apple-blue focus:ring-offset-1"
                checked={selectedMetric === 'population_density'}
                onChange={() => onMetricChange('population_density')}
              />
              <label htmlFor="population-density" className="ml-2.5 block text-sm text-gray-800">
                Population Density
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="total-population"
                name="metric"
                type="radio"
                className="h-4 w-4 text-apple-blue border-apple-gray-300 focus:ring-apple-blue focus:ring-offset-1"
                checked={selectedMetric === 'population'}
                onChange={() => onMetricChange('population')}
              />
              <label htmlFor="total-population" className="ml-2.5 block text-sm text-gray-800">
                Total Population
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="gdp-per-capita"
                name="metric"
                type="radio"
                className="h-4 w-4 text-apple-blue border-apple-gray-300 focus:ring-apple-blue focus:ring-offset-1"
                checked={selectedMetric === 'gdp_per_capita'}
                onChange={() => onMetricChange('gdp_per_capita')}
              />
              <label htmlFor="gdp-per-capita" className="ml-2.5 block text-sm text-gray-800">
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
