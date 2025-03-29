
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner py-4 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="text-center text-sm text-gray-500">
          <p>World Data Explorer &copy; {new Date().getFullYear()} | Interactive Global Data Visualization Project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
