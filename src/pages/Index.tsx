
import React, { useEffect } from 'react';
import WorldMap from '@/components/WorldMap';
import Legend from '@/components/Legend';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { MapSearch, BarChart3 } from 'lucide-react';

const Index = () => {
  // Initialize Sentry
  useEffect(() => {
    initializeSentry();
  }, []);

  // Fetch countries data
  const { countries, loading, error } = useCountryData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900">World Map Mosaic</h1>
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
                    <button className="flex items-center justify-center px-4 py-2 bg-blue-100 rounded-md text-blue-700 font-medium text-sm hover:bg-blue-200 transition-colors">
                      <MapSearch className="mr-2 h-4 w-4" />
                      Map
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md text-gray-500 font-medium text-sm hover:bg-gray-200 transition-colors">
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
                        defaultChecked
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
                      />
                      <label htmlFor="total-population" className="ml-2 block text-sm text-gray-700">
                        Total Population
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Legend />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium mb-2 text-gray-700">About the Data</h3>
              <p className="text-xs text-gray-600">
                This visualization displays population density based on the latest 
                available census data. Colors indicate the number of people per square kilometer.
              </p>
            </div>
          </div>

          {/* Map container */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-12rem)]">
            <WorldMap countries={countries} loading={loading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 px-6 mt-auto">
        <div className="container mx-auto">
          <div className="text-center text-sm text-gray-500">
            <p>World Map Mosaic &copy; {new Date().getFullYear()} | Data Visualization Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
