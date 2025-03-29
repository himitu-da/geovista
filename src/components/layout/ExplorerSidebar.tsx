
import React, { useState } from 'react';
import { DataMetric, CountryData } from '@/types/country';
import { Badge } from 'lucide-react';
import AIInsights from '@/components/AIInsights';
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
import SidebarNavigation from './sidebar/SidebarNavigation';
import SidebarVisualizationSection from './sidebar/SidebarVisualizationSection';
import SidebarMetricsSection from './sidebar/SidebarMetricsSection';
import SidebarInfoSection from './sidebar/SidebarInfoSection';

// セクションの型定義
type SidebarSection = 'visualization' | 'metrics' | 'insights' | 'info';

interface ExplorerSidebarProps {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
  onMetricChange: (metric: DataMetric) => void;
  selectedCountry: string | null;
  countries: CountryData[];
}

/**
 * 探索機能のサイドバーコンポーネント
 * データビジュアライゼーションのコントロールとインサイトを提供するメインコントロールパネル
 */
const ExplorerSidebar: React.FC<ExplorerSidebarProps> = ({
  visualizationType,
  selectedMetric,
  onVisualizationTypeChange,
  onMetricChange,
  selectedCountry,
  countries
}) => {
  // アクティブなセクションの状態管理
  const [activeSection, setActiveSection] = useState<SidebarSection>('visualization');
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
          <SidebarGroupLabel className="text-[10px] sm:text-xs">{t('navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarNavigation 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              hasSelectedCountry={!!selectedCountry}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* コンテンツセクション - 選択されたセクションに基づいて表示 */}
        {renderActiveSection(
          activeSection, 
          {
            visualizationType,
            selectedMetric, 
            onVisualizationTypeChange, 
            onMetricChange,
            selectedCountry,
            countries
          },
          isMobile
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="text-[8px] sm:text-xs text-gray-500 p-1 sm:p-2">
          {t('enjoyExploring')}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

/**
 * アクティブなセクションに基づいて、対応するコンポーネントをレンダリング
 */
const renderActiveSection = (
  activeSection: SidebarSection,
  props: {
    visualizationType: 'map' | 'chart';
    selectedMetric: DataMetric;
    onVisualizationTypeChange: (type: 'map' | 'chart') => void;
    onMetricChange: (metric: DataMetric) => void;
    selectedCountry: string | null;
    countries: CountryData[];
  },
  isMobile: boolean
) => {
  const { t } = useLanguage();
  const { 
    visualizationType, 
    selectedMetric, 
    onVisualizationTypeChange, 
    onMetricChange,
    selectedCountry,
    countries 
  } = props;
  
  // アクティブなセクションに基づいて、適切なコンポーネントを返す
  switch (activeSection) {
    case 'visualization':
      return (
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] sm:text-xs">{t('visualizationType')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarVisualizationSection 
              visualizationType={visualizationType}
              selectedMetric={selectedMetric}
              onVisualizationTypeChange={onVisualizationTypeChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      );
      
    case 'metrics':
      return (
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
      );
      
    case 'insights':
      return selectedCountry ? (
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] sm:text-xs">{t('aiInsights')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <AIInsights 
              country={countries.find(c => c.id === selectedCountry)} 
              metric={selectedMetric} 
            />
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null;
      
    case 'info':
      return (
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] sm:text-xs">{t('information')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarInfoSection />
          </SidebarGroupContent>
        </SidebarGroup>
      );
      
    default:
      return null;
  }
};

export default ExplorerSidebar;
