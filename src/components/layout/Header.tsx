
import React from 'react';
import { motion } from 'framer-motion';
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
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md h-12 px-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-2"
      >
        <Link
          to="/"
          className="text-lg font-semibold text-blue-600 dark:text-blue-400 tracking-tight flex items-center"
        >
          <Database className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">World Data Explorer</span>
        </Link>
      </motion.div>

      <div className="flex items-center space-x-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </a>
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;
