
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 mt-auto border-t border-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center space-x-4">
            <Link to="/" className="text-apple-gray-700 hover:text-primary transition-colors flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>ホームに戻る</span>
            </Link>
            <div className="flex items-center space-x-3">
              <a href="#" className="text-apple-gray-600 hover:text-gray-900 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-apple-gray-600 hover:text-gray-900 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="text-sm text-apple-gray-500 text-center md:text-right">
            <p>World Data Explorer &copy; {new Date().getFullYear()} | インタラクティブなグローバルデータビジュアライゼーション</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
