
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-900">World Data Explorer</h1>
          <div className="text-sm text-gray-500">
            Interactive Global Data Visualization
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
