
import React from 'react';
import { ZoomIn, Menu, User, Info } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarNavigationProps {
  activeSection: 'visualization' | 'metrics' | 'insights' | 'info';
  setActiveSection: React.Dispatch<React.SetStateAction<'visualization' | 'metrics' | 'insights' | 'info'>>;
  hasSelectedCountry: boolean;
}

/**
 * サイドバーナビゲーションメニューコンポーネント
 * 各セクションへの切り替えメニューを提供
 */
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  setActiveSection,
  hasSelectedCountry
}) => {
  const { t } = useLanguage();
  
  return (
    <SidebarMenu>
      <NavigationMenuItem 
        section="visualization"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={<ZoomIn className="size-4" />}
        label={t('visualizationType')}
      />
      
      <NavigationMenuItem 
        section="metrics"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={<Menu className="size-4" />}
        label={t('dataMetrics')}
      />
      
      {hasSelectedCountry && (
        <NavigationMenuItem 
          section="insights"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          icon={<User className="size-4" />}
          label={t('aiInsights')}
        />
      )}
      
      <NavigationMenuItem 
        section="info"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        icon={<Info className="size-4" />}
        label={t('information')}
      />
    </SidebarMenu>
  );
};

// ナビゲーションメニュー項目コンポーネント
interface NavigationMenuItemProps {
  section: 'visualization' | 'metrics' | 'insights' | 'info';
  activeSection: 'visualization' | 'metrics' | 'insights' | 'info';
  setActiveSection: React.Dispatch<React.SetStateAction<'visualization' | 'metrics' | 'insights' | 'info'>>;
  icon: React.ReactNode;
  label: string;
}

const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  section,
  activeSection,
  setActiveSection,
  icon,
  label
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton 
      isActive={activeSection === section} 
      onClick={() => setActiveSection(section)}
      tooltip={label}
      className={activeSection === section ? "bg-blue-50 dark:bg-blue-950/40" : ""}
    >
      <span className={`${activeSection === section ? "text-blue-600 dark:text-blue-400" : ""}`}>
        {icon}
      </span>
      <span className={`${activeSection === section ? "font-medium text-blue-700 dark:text-blue-300" : ""}`}>{label}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default SidebarNavigation;
