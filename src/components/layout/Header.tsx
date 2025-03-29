
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Link } from 'react-router-dom';
import { Database, Github } from 'lucide-react';

/**
 * ヘッダーコンポーネント
 * アプリケーションの上部に表示され、タイトルと言語切り替えコントロールを含む
 */
const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-10 px-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-2">
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-tight flex items-center"
        >
          <Database className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">World Data Explorer</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-3.5 w-3.5" />
        </a>
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;
