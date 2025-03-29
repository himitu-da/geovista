
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner py-6 px-6 mt-auto border-t border-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-apple-gray-700 hover:text-primary transition-colors">
              ホームに戻る
            </Link>
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
