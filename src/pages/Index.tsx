
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
import InfoPanel from '@/components/InfoPanel';
import ErrorMessage from '@/components/ErrorMessage';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import ExplorerSidebar from '@/components/layout/ExplorerSidebar';

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
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main content - Full screen with sidebar */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex w-full h-[calc(100vh-10rem)] overflow-hidden"
      >
        <ErrorMessage error={error} />

        <SidebarProvider>
          <div className="flex h-full w-full overflow-hidden">
            {/* Sidebar with controls */}
            <ExplorerSidebar 
              visualizationType={visualizationType}
              selectedMetric={selectedMetric}
              onVisualizationTypeChange={setVisualizationType}
              onMetricChange={setSelectedMetric}
              selectedCountry={selectedCountry}
              countries={countries}
            />

            {/* Main content area - full screen map or chart */}
            <div className="flex-1 h-full overflow-hidden">
              <AnimatePresence mode="wait">
                {visualizationType === 'map' ? (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <WorldMap 
                      countries={countries} 
                      loading={loading} 
                      selectedMetric={selectedMetric}
                      onCountrySelect={setSelectedCountry}
                      selectedCountry={selectedCountry}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <DataChart 
                      countries={countries}
                      loading={loading}
                      selectedMetric={selectedMetric}
                      selectedCountry={selectedCountry}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SidebarProvider>
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
