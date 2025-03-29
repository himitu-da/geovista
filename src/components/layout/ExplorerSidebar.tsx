
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
  
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="h-6 w-6" />
          <span className="font-medium text-sm">{t('explorer')}</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation')}</SidebarGroupLabel>
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
          }
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="text-xs text-gray-500 p-2">
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
  }
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
          <SidebarGroupLabel>{t('visualizationType')}</SidebarGroupLabel>
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
          <SidebarGroupLabel>{t('dataMetrics')}</SidebarGroupLabel>
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
          <SidebarGroupLabel>{t('aiInsights')}</SidebarGroupLabel>
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
          <SidebarGroupLabel>{t('information')}</SidebarGroupLabel>
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
