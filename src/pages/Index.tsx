
import React, { useEffect, useState } from 'react';
import WorldMap from '@/components/WorldMap';
import Legend from '@/components/Legend';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { DataMetric } from '@/types/country';
import AIInsights from '@/components/AIInsights';
import DataChart from '@/components/DataChart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DataControls from '@/components/controls/DataControls';
import InfoPanel from '@/components/InfoPanel';
import ErrorMessage from '@/components/ErrorMessage';

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
      <Header />

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <ErrorMessage error={error} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <DataControls 
              visualizationType={visualizationType}
              selectedMetric={selectedMetric}
              onVisualizationTypeChange={setVisualizationType}
              onMetricChange={setSelectedMetric}
            />
            
            <Legend metric={selectedMetric} />
            
            {selectedCountry && countries.length > 0 && (
              <AIInsights 
                country={countries.find(c => c.id === selectedCountry)} 
                metric={selectedMetric} 
              />
            )}
            
            <InfoPanel />
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
      <Footer />
    </div>
  );
};

export default Index;
