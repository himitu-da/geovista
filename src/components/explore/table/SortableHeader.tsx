
import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type SortableColumn = 'name' | 'population' | 'area_km2' | 'gdp_per_capita' | 'population_density';

interface SortableHeaderProps {
  label: string;
  column: SortableColumn;
  sortConfig: {
    key: SortableColumn;
    direction: 'ascending' | 'descending';
  };
  onSort: (column: SortableColumn) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  column,
  sortConfig,
  onSort
}) => {
  const isMobile = useIsMobile();
  const isActive = sortConfig.key === column;
  
  const renderSortIcon = () => {
    if (!isActive) return <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />;
    
    return sortConfig.direction === 'ascending'
      ? <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
      : <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />;
  };

  return (
    <th 
      scope="col" 
      className={`px-2 sm:px-4 py-2 sm:py-3 text-left text-[8px] sm:text-xs font-medium tracking-wider cursor-pointer ${
        isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
      }`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span className="truncate">{label}</span>
        <span className="flex-shrink-0">{renderSortIcon()}</span>
      </div>
    </th>
  );
};

export default SortableHeader;
