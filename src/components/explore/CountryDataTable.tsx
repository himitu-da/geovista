
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CountryData, DataMetric } from '@/types/country';
import { 
  Search, ArrowUpDown, ArrowUp, ArrowDown, Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'population' | 'area_km2' | 'gdp_per_capita' | 'population_density';
    direction: 'ascending' | 'descending';
  }>({
    key: 'name',
    direction: 'ascending'
  });
  
  // フィルタリングされた国のリスト
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // ソートされた国のリスト
  const sortedCountries = React.useMemo(() => {
    const sortableItems = [...filteredCountries];
    
    if (sortConfig.key === 'population_density') {
      return sortableItems.sort((a, b) => {
        const valueA = a.area_km2 ? a.population / a.area_km2 : 0;
        const valueB = b.area_km2 ? b.population / b.area_km2 : 0;
        
        return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
      });
    }
    
    return sortableItems.sort((a, b) => {
      // nullチェック
      if (sortConfig.key !== 'name') {
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;
        
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      
      // 名前でのソート
      return sortConfig.direction === 'ascending' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
  }, [filteredCountries, sortConfig]);
  
  // ソートを処理する関数
  const handleSort = (key: typeof sortConfig.key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
      });
    } else {
      setSortConfig({
        key,
        direction: 'ascending'
      });
    }
  };
  
  // メトリック表示の書式設定
  const formatMetricValue = (country: CountryData, metric: DataMetric) => {
    switch (metric) {
      case 'population_density':
        return country.area_km2 
          ? `${(country.population / country.area_km2).toFixed(1)} 人/km²` 
          : 'N/A';
      case 'population':
        return country.population.toLocaleString() + ' 人';
      case 'gdp_per_capita':
        return country.gdp_per_capita 
          ? `$${country.gdp_per_capita.toLocaleString()}` 
          : 'N/A';
      default:
        return 'N/A';
    }
  };
  
  // ソートアイコンを表示
  const renderSortIcon = (key: typeof sortConfig.key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    
    return sortConfig.direction === 'ascending'
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={t('searchCountries')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('country')}</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('population')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('population')}</span>
                  {renderSortIcon('population')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(selectedMetric === 'population_density' ? 'population_density' : (selectedMetric === 'gdp_per_capita' ? 'gdp_per_capita' : 'population'))}
              >
                <div className="flex items-center space-x-1">
                  <span>{t(selectedMetric === 'population_density' ? 'populationDensity' : (selectedMetric === 'gdp_per_capita' ? 'gdpPerCapita' : 'totalPopulation'))}</span>
                  {renderSortIcon(selectedMetric === 'population_density' ? 'population_density' : (selectedMetric === 'gdp_per_capita' ? 'gdp_per_capita' : 'population'))}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sortedCountries.map((country) => (
                <motion.tr 
                  key={country.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`hover:bg-gray-50 ${selectedCountry === country.id ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {country.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {country.population.toLocaleString()} 人
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatMetricValue(country, selectedMetric)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onCountrySelect(selectedCountry === country.id ? null : country.id)}
                      className={`inline-flex items-center py-1 px-2 border rounded-md text-xs font-medium ${
                        selectedCountry === country.id
                          ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Map className="mr-1 h-3 w-3" />
                      {selectedCountry === country.id ? t('viewing') : t('viewOnMap')}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountryDataTable;
