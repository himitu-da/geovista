
import React, { useState } from 'react';
import { DataMetric, CountryData } from '@/types/country';
import { Map, BarChart3, Menu, ZoomIn, Plus, User, Info, Badge } from 'lucide-react';
import Legend from '@/components/Legend';
import AIInsights from '@/components/AIInsights';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExplorerSidebarProps {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
  onMetricChange: (metric: DataMetric) => void;
  selectedCountry: string | null;
  countries: CountryData[];
}

const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({
  visualizationType,
  selectedMetric,
  onVisualizationTypeChange,
  onMetricChange,
  selectedCountry,
  countries
}) => {
  const [activeSection, setActiveSection] = useState<'visualization' | 'metrics' | 'insights' | 'info'>('visualization');
  const { t } = useLanguage();
  
  // Find the selected country data
  const selectedCountryData = selectedCountry 
    ? countries.find(c => c.id === selectedCountry) 
    : null;

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="h-6 w-6" />
          <span className="font-medium text-sm">{t('explorer')}</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'visualization'} 
                  onClick={() => setActiveSection('visualization')}
                  tooltip={t('visualizationType')}
                >
                  <ZoomIn className="size-4" />
                  <span>{t('visualizationType')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'metrics'} 
                  onClick={() => setActiveSection('metrics')}
                  tooltip={t('dataMetrics')}
                >
                  <Menu className="size-4" />
                  <span>{t('dataMetrics')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {selectedCountry && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeSection === 'insights'} 
                    onClick={() => setActiveSection('insights')}
                    tooltip={t('aiInsights')}
                  >
                    <User className="size-4" />
                    <span>{t('aiInsights')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'info'} 
                  onClick={() => setActiveSection('info')}
                  tooltip={t('information')}
                >
                  <Info className="size-4" />
                  <span>{t('information')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {activeSection === 'visualization' && (
          <SidebarGroup>
            <SidebarGroupLabel>{t('visualizationType')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <Card className="border-none shadow-none">
                <CardContent className="p-3">
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
                      {t('map')}
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
                      {t('chart')}
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Legend metric={selectedMetric} />
              </motion.div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {activeSection === 'metrics' && (
          <SidebarGroup>
            <SidebarGroupLabel>{t('dataMetrics')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <Card className="border-none shadow-none">
                <CardContent className="p-3">
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
                        {t('populationDensity')}
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
                        {t('totalPopulation')}
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
                        {t('gdpPerCapita')}
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {selectedCountry && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">{t('selectedCountry')}: {selectedCountryData?.name}</h3>
                  {selectedCountryData && (
                    <div className="text-xs text-blue-700">
                      <p>{t('population')}: {selectedCountryData.population.toLocaleString()}</p>
                      {selectedCountryData.area_km2 && (
                        <p>{t('area')}: {selectedCountryData.area_km2.toLocaleString()} km²</p>
                      )}
                      {selectedCountryData.gdp_per_capita && (
                        <p>{t('gdpPerCapita')}: ${selectedCountryData.gdp_per_capita.toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {activeSection === 'insights' && selectedCountry && (
          <SidebarGroup>
            <SidebarGroupLabel>{t('aiInsights')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <AIInsights 
                country={countries.find(c => c.id === selectedCountry)} 
                metric={selectedMetric} 
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {activeSection === 'info' && (
          <SidebarGroup>
            <SidebarGroupLabel>{t('information')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <Card className="border-none shadow-none">
                <CardContent className="p-3 text-sm text-gray-600">
                  <p className="mb-2">{t('aboutTheApp')}</p>
                  <p className="mb-2">{t('compareCountries')}</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>{t('mapView')}</li>
                    <li>{t('chartView')}</li>
                    <li>{t('aiInsightFeature')}</li>
                  </ul>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="text-xs text-gray-500 p-2">
          {t('enjoyExploring')}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ExplorerSidebar;
