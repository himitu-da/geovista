
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CountryData, DataMetric } from '@/types/country';
import { useSortedCountries } from '@/hooks/useSortedCountries';
import { formatMetricValue } from '@/utils/formatters';
import SearchBar from './table/SearchBar';
import SortableHeader from './table/SortableHeader';
import CountryTableRow from './table/CountryTableRow';

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
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
              <SortableHeader
                label={t(selectedMetric === 'population_density' ? 'populationDensity' : (selectedMetric === 'gdp_per_capita' ? 'gdpPerCapita' : 'totalPopulation'))}
                column={selectedMetric === 'population_density' ? 'population_density' : (selectedMetric === 'gdp_per_capita' ? 'gdp_per_capita' : 'population')}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sortedCountries.map((country) => (
                <CountryTableRow
                  key={country.id}
                  country={country}
                  selectedMetric={selectedMetric}
                  selectedCountry={selectedCountry}
                  onCountrySelect={onCountrySelect}
                  formatMetricValue={formatMetricValue}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountryDataTable;
