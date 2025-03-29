
import { useMemo, useState } from 'react';
import { CountryData, DataMetric } from '@/types/country';

type SortableColumn = 'name' | 'population' | 'area_km2' | 'gdp_per_capita' | 'population_density';
type SortDirection = 'ascending' | 'descending';

export interface SortConfig {
  key: SortableColumn;
  direction: SortDirection;
}

export function useSortedCountries(countries: CountryData[], searchQuery: string) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'ascending'
  });
  
  // フィルタリングされた国のリスト
  const filteredCountries = useMemo(() => {
    return countries.filter(country => 
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countries, searchQuery]);
  
  // ソートされた国のリスト
  const sortedCountries = useMemo(() => {
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
  const handleSort = (key: SortableColumn) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
        };
      } else {
        return {
          key,
          direction: 'ascending'
        };
      }
    });
  };
  
  return { sortedCountries, sortConfig, handleSort };
}
