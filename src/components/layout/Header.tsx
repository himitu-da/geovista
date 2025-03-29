
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Link } from 'react-router-dom';
import { Database, Github } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MetricDropdown from '@/components/controls/MetricDropdown';
import { useLocation } from 'react-router-dom';
import { DataMetric } from '@/types/country';

interface HeaderProps {
  selectedMetric?: DataMetric;
  onMetricChange?: (metric: DataMetric) => void;
}

/**
 * ヘッダーコンポーネント
 * アプリケーションの上部に表示され、タイトルと言語切り替えコントロールを含む
 */
const Header: React.FC<HeaderProps> = ({ 
  selectedMetric = 'population_density',
  onMetricChange
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const isExplorePage = location.pathname === '/explore';

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-2 sm:px-3 border-b border-gray-100 dark:border-gray-800">
      <div className="h-8 sm:h-10 flex items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-tight flex items-center"
          >
            <Database className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
            <span className={isMobile ? "hidden" : "inline"}>GeoVista</span>
          </Link>
        </div>

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
      </div>
      
      {/* モバイル用の2段目表示 */}
      {isMobile && isExplorePage && onMetricChange && (
        <div className="py-2 flex justify-center">
          <MetricDropdown 
            selectedMetric={selectedMetric}
            onMetricChange={onMetricChange}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
