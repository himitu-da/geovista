
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <Header />

      {/* Main content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-6"
      >
        <ErrorMessage error={error} />

        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-12rem)] w-full">
            {/* Sidebar with controls */}
            <ExplorerSidebar 
              visualizationType={visualizationType}
              selectedMetric={selectedMetric}
              onVisualizationTypeChange={setVisualizationType}
              onMetricChange={setSelectedMetric}
              selectedCountry={selectedCountry}
              countries={countries}
            />

            {/* Main content area */}
            <div className="flex-1 bg-white rounded-xl shadow-apple-md overflow-hidden h-[calc(100vh-12rem)] ml-4">
              <AnimatePresence mode="wait">
                {visualizationType === 'map' ? (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
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
                    className="h-full"
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
