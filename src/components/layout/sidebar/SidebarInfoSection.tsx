
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Information section component for the application
 * Displays app overview and usage instructions
 */
const SidebarInfoSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
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
  );
};

export default SidebarInfoSection;
