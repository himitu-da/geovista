
import React from 'react';
import { Info } from 'lucide-react';

const InfoPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
        <Info className="mr-2 h-4 w-4 text-blue-500" />
        About the Data
      </h3>
      <p className="text-xs text-gray-600">
        This visualization displays global statistics based on the latest 
        available data. Select different metrics and countries to explore patterns
        and insights across the world.
      </p>
    </div>
  );
};

export default InfoPanel;
