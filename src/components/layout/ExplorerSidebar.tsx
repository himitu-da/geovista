
import React, { useState } from 'react';
import { DataMetric, CountryData } from '@/types/country';
import { Badge } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

// 分割したコンポーネントをインポート
import SidebarMetricsSection from './sidebar/SidebarMetricsSection';
import SidebarInfoSection from './sidebar/SidebarInfoSection';
import { DataCategory } from '@/components/explore/DataCategoryNav';

// セクションの型定義
type SidebarSection = 'metrics' | 'info';

interface ExplorerSidebarProps {
  selectedMetric: DataMetric;
  onMetricChange: (metric: DataMetric) => void;
  selectedCountry: string | null;
  countries: CountryData[];
  activeCategory: DataCategory;
  onCategoryChange: (category: DataCategory) => void;
}

/**
 * 探索機能のサイドバーコンポーネント
 * データビジュアライゼーションのコントロールとインサイトを提供するメインコントロールパネル
 */
const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({
  selectedMetric,
  onMetricChange,
  selectedCountry,
  countries,
  activeCategory,
  onCategoryChange
}) => {
  // アクティブなセクションの状態管理
  const [activeSection, setActiveSection] = useState<SidebarSection>('metrics');
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <Sidebar variant={isMobile ? "inset" : "floating"} collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-1 sm:p-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Badge className="h-4 w-4 sm:h-6 sm:w-6" />
          <span className="font-medium text-xs sm:text-sm">{t('explorer')}</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] sm:text-xs">{t('dataMetrics')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMetricsSection 
              selectedMetric={selectedMetric}
              onMetricChange={onMetricChange}
              selectedCountry={selectedCountry}
              countries={countries}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] sm:text-xs">{t('information')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarInfoSection />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="text-[8px] sm:text-xs text-gray-500 p-1 sm:p-2">
          {t('enjoyExploring')}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ExplorerSidebar;
