
import React, { useEffect, useState } from 'react';
import WorldMap from '@/components/WorldMap';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { DataMetric } from '@/types/country';
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import ExplorerSidebar from '@/components/layout/ExplorerSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Error Message */}
      <ErrorMessage error={error} />
      
      {/* Full screen map as base layer */}
      <div className="absolute inset-0 z-0">
        <WorldMap 
          countries={countries} 
          loading={loading} 
          selectedMetric={selectedMetric}
          onCountrySelect={setSelectedCountry}
          selectedCountry={selectedCountry}
        />
      </div>
      
      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col h-full pointer-events-none"
        >
          {/* Header - with pointer events */}
          <div className="pointer-events-auto">
            <Header />
          </div>
          
          {/* Main Content - Sidebar with controls */}
          <div className="flex-grow flex">
            <SidebarProvider>
              <div className="h-full pointer-events-auto">
                <ExplorerSidebar 
                  visualizationType={visualizationType}
                  selectedMetric={selectedMetric}
                  onVisualizationTypeChange={setVisualizationType}
                  onMetricChange={setSelectedMetric}
                  selectedCountry={selectedCountry}
                  countries={countries}
                />
              </div>
            </SidebarProvider>
          </div>
          
          {/* Footer - with pointer events */}
          <div className="pointer-events-auto">
            <Footer />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
