
import React from 'react';

const Legend: React.FC = () => {
  const legendItems = [
    { color: '#e2f1ff', label: '0' },
    { color: '#c8e1ff', label: '10' },
    { color: '#94c8ff', label: '50' },
    { color: '#64a9ff', label: '100' },
    { color: '#3485ed', label: '500' },
    { color: '#0061db', label: '1000+' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium mb-2">Population Density (people/km²)</h3>
      <div className="flex flex-col space-y-1">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
