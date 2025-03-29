
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CountryData, DataMetric } from '@/types/country';
import { useSortedCountries } from '@/hooks/useSortedCountries';
import { formatMetricValue } from '@/utils/formatters';
import SearchBar from './table/SearchBar';
import SortableHeader from './table/SortableHeader';
import CountryTableRow from './table/CountryTableRow';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CountryDataTableProps {
  countries: CountryData[];
  selectedMetric: DataMetric;
  onCountrySelect: (countryId: string | null) => void;
  selectedCountry: string | null;
}

const CountryDataTable: React.FC<CountryDataTableProps> = ({
  countries,
  selectedMetric,
  onCountrySelect,
  selectedCountry
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const { sortedCountries, sortConfig, handleSort } = useSortedCountries(countries, searchQuery);
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-0 py-0">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <SortableHeader
                  label={t('country')}
                  column="name"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label={t('population')}
                  column="population"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                {!isMobile && (
                  <SortableHeader
                    label={t(selectedMetric === 'population_density' ? 'populationDensity' : (selectedMetric === 'gdp_per_capita' ? 'gdpPerCapita' : 'totalPopulation'))}
                    column={selectedMetric === 'population_density' ? 'population_density' : (selectedMetric === 'gdp_per_capita' ? 'gdp_per_capita' : 'population')}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                )}
                <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[8px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {sortedCountries.length > 0 ? (
                  sortedCountries.map((country) => (
                    <CountryTableRow
                      key={country.id}
                      country={country}
                      selectedMetric={selectedMetric}
                      selectedCountry={selectedCountry}
                      onCountrySelect={onCountrySelect}
                      formatMetricValue={formatMetricValue}
                      showMetricColumn={!isMobile}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={isMobile ? 3 : 4} className="px-2 sm:px-4 py-2 sm:py-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {t('noCountriesFound')}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryDataTable;
