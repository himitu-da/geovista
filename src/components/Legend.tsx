
import React from 'react';
import { DataMetric } from '@/types/country';

interface LegendProps {
  metric: DataMetric;
}

const Legend: React.FC<LegendProps> = ({ metric }) => {
  // 選択した指標に基づいて凡例項目を設定
  const getLegendConfig = () => {
    if (metric === 'population_density') {
      return {
        title: '人口密度（人/km²）',
        items: [
          { color: '#E8F5E9', label: '0' },
          { color: '#C8E6C9', label: '10' },
          { color: '#A5D6A7', label: '50' },
          { color: '#81C784', label: '100' },
          { color: '#66BB6A', label: '500' },
          { color: '#4CAF50', label: '1000+' },
        ]
      };
    } 
    else if (metric === 'population') {
      return {
        title: '人口',
        items: [
          { color: '#E3F2FD', label: '< 1M' },
          { color: '#BBDEFB', label: '1-10M' },
          { color: '#90CAF9', label: '10-50M' },
          { color: '#64B5F6', label: '50-100M' },
          { color: '#42A5F5', label: '100-500M' },
          { color: '#2196F3', label: '> 500M' },
        ]
      };
    }
    else if (metric === 'gdp_per_capita') {
      return {
        title: '一人当たりGDP（米ドル）',
        items: [
          { color: '#FFF3E0', label: '< $1,000' },
          { color: '#FFE0B2', label: '$1,000-5,000' },
          { color: '#FFCC80', label: '$5,000-15,000' },
          { color: '#FFB74D', label: '$15,000-30,000' },
          { color: '#FFA726', label: '$30,000-50,000' },
          { color: '#FF9800', label: '> $50,000' },
        ]
      };
    }
    
    // デフォルトのフォールバック
    return {
      title: 'データスケール',
      items: [
        { color: '#E8F5E9', label: '低' },
        { color: '#C8E6C9', label: '' },
        { color: '#A5D6A7', label: '' },
        { color: '#81C784', label: '' },
        { color: '#66BB6A', label: '' },
        { color: '#4CAF50', label: '高' },
      ]
    };
  };

  const legendConfig = getLegendConfig();

  return (
    <div className="bg-white rounded-lg shadow-md p-2.5 sm:p-3">
      <h3 className="text-xs font-medium mb-1.5">{legendConfig.title}</h3>
      <div className="flex flex-col space-y-1">
        {legendConfig.items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3.5 h-3.5 mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-[10px] sm:text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
