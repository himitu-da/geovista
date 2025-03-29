
import React, { useEffect, useState } from 'react';
import WorldMap from '@/components/WorldMap';
import Legend from '@/components/Legend';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { Map, BarChart3, MicIcon, Info } from 'lucide-react';
import { DataMetric } from '@/types/country';
import AIInsights from '@/components/AIInsights';
import DataChart from '@/components/DataChart';

const Index = () => {
  // Initialize Sentry
  useEffect(() => {
    initializeSentry();
  }, []);

  // State for UI
  const [visualizationType, setVisualizationType] = useState<'map' | 'chart'>('map');
  const [selectedMetric, setSelectedMetric] = useState<DataMetric>('population_density');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Fetch countries data
  const { countries, loading, error } = useCountryData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900">World Data Explorer</h1>
            <div className="text-sm text-gray-500">
              Interactive Global Data Visualization
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            <p className="font-medium">Error loading data</p>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Note: This application requires Supabase integration with a countries table. 
              Please connect your Supabase project with the appropriate schema.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls sidebar */}
          <div className="lg:col-span-1 space-y-6">
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
                      onClick={() => setVisualizationType('map')}
                    >
                      <Map className="mr-2 h-4 w-4" />
                      Map
                    </button>
                    <button 
                      className={`flex items-center justify-center px-4 py-2 ${
                        visualizationType === 'chart' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      } rounded-md font-medium text-sm hover:bg-gray-200 transition-colors`}
                      onClick={() => setVisualizationType('chart')}
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
                        onChange={() => setSelectedMetric('population_density')}
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
                        onChange={() => setSelectedMetric('population')}
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
                        onChange={() => setSelectedMetric('gdp_per_capita')}
                      />
                      <label htmlFor="gdp-per-capita" className="ml-2 block text-sm text-gray-700">
                        GDP Per Capita
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Legend metric={selectedMetric} />
            
            {selectedCountry && countries.length > 0 && (
              <AIInsights 
                country={countries.find(c => c.id === selectedCountry)} 
                metric={selectedMetric} 
              />
            )}
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium mb-2 text-gray-700">About the Data</h3>
              <p className="text-xs text-gray-600">
                This visualization displays global statistics based on the latest 
                available data. Select different metrics and countries to explore patterns
                and insights across the world.
              </p>
            </div>
          </div>

          {/* Map/Chart container */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-12rem)]">
            {visualizationType === 'map' ? (
              <WorldMap 
                countries={countries} 
                loading={loading} 
                selectedMetric={selectedMetric}
                onCountrySelect={setSelectedCountry}
                selectedCountry={selectedCountry}
              />
            ) : (
              <DataChart 
                countries={countries}
                loading={loading}
                selectedMetric={selectedMetric}
                selectedCountry={selectedCountry}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 px-6 mt-auto">
        <div className="container mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>World Data Explorer &copy; {new Date().getFullYear()} | Interactive Global Data Visualization Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
