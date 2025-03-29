
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Link } from 'react-router-dom';
import { Database, Github } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MetricDropdown from '@/components/controls/MetricDropdown';
import { useLocation } from 'react-router-dom';

/**
 * ヘッダーコンポーネント
 * アプリケーションの上部に表示され、タイトルと言語切り替えコントロールを含む
 */
const Header: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const isExplore = location.pathname === '/explore';

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-auto min-h-8 sm:min-h-10 px-2 sm:px-3 flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-1 sm:space-x-2 py-2">
        <Link
          to="/"
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-tight flex items-center"
        >
          <Database className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
          <span className={isMobile ? "hidden" : "inline"}>GeoVista</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 pb-2 sm:pb-0">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </a>
          <LanguageToggle />
        </div>
        
        {/* メトリック選択ドロップダウン - モバイル表示かつExploreページの場合 */}
        {isMobile && isExplore && (
          <div className="w-full">
            <MetricDropdown 
              selectedMetric="population_density"
              onMetricChange={() => {}}
              isInHeader={true}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
