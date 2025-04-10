
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
 * Sidebar navigation menu component
 * Provides navigation between different sections
 */
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  setActiveSection,
  hasSelectedCountry
}) => {
  const { t } = useLanguage();
  
  const navigationItems = [
    {
      section: 'visualization' as const,
      icon: <ZoomIn className="size-3" />,
      label: t('visualizationType'),
    },
    {
      section: 'metrics' as const,
      icon: <Menu className="size-3" />,
      label: t('dataMetrics'),
    },
    {
      section: 'insights' as const,
      icon: <User className="size-3" />,
      label: t('aiInsights'),
      condition: hasSelectedCountry
    },
    {
      section: 'info' as const,
      icon: <Info className="size-3" />,
      label: t('information'),
    }
  ];
  
  return (
    <SidebarMenu>
      {navigationItems
        .filter(item => item.condition !== false)
        .map(item => (
          <SidebarMenuItem key={item.section}>
            <SidebarMenuButton 
              isActive={activeSection === item.section} 
              onClick={() => setActiveSection(item.section)}
              tooltip={item.label}
              className="p-1"
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
};

export default SidebarNavigation;
