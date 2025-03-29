
import React from 'react';
import { DataMetric } from '@/types/country';

interface LegendProps {
  metric: DataMetric;
}

const Legend: React.FC<LegendProps> = ({ metric }) => {
  // Configure legend items based on selected metric
  const getLegendConfig = () => {
    if (metric === 'population_density') {
      return {
        title: 'Population Density (people/km²)',
        items: [
          { color: '#e2f1ff', label: '0' },
          { color: '#c8e1ff', label: '10' },
          { color: '#94c8ff', label: '50' },
          { color: '#64a9ff', label: '100' },
          { color: '#3485ed', label: '500' },
          { color: '#0061db', label: '1000+' },
        ]
      };
    } 
    else if (metric === 'population') {
      return {
        title: 'Population',
        items: [
          { color: '#e2f1ff', label: '< 1M' },
          { color: '#c8e1ff', label: '1-10M' },
          { color: '#94c8ff', label: '10-50M' },
          { color: '#64a9ff', label: '50-100M' },
          { color: '#3485ed', label: '100-500M' },
          { color: '#0061db', label: '> 500M' },
        ]
      };
    }
    else if (metric === 'gdp_per_capita') {
      return {
        title: 'GDP Per Capita (USD)',
        items: [
          { color: '#e2f1ff', label: '< $1,000' },
          { color: '#c8e1ff', label: '$1,000-5,000' },
          { color: '#94c8ff', label: '$5,000-15,000' },
          { color: '#64a9ff', label: '$15,000-30,000' },
          { color: '#3485ed', label: '$30,000-50,000' },
          { color: '#0061db', label: '> $50,000' },
        ]
      };
    }
    
    // Default fallback
    return {
      title: 'Data Scale',
      items: [
        { color: '#e2f1ff', label: 'Low' },
        { color: '#c8e1ff', label: '' },
        { color: '#94c8ff', label: '' },
        { color: '#64a9ff', label: '' },
        { color: '#3485ed', label: '' },
        { color: '#0061db', label: 'High' },
      ]
    };
  };

  const legendConfig = getLegendConfig();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 text-xs">
      <h3 className="text-xs font-medium mb-1">{legendConfig.title}</h3>
      <div className="flex flex-col gap-0.5">
        {legendConfig.items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-[10px] truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
