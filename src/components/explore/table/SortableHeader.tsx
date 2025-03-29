
import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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
  const renderSortIcon = () => {
    if (sortConfig.key !== column) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    
    return sortConfig.direction === 'ascending'
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {renderSortIcon()}
      </div>
    </th>
  );
};

export default SortableHeader;
