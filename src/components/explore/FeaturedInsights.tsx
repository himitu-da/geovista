
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, TrendingUp, Map, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

// Compact insight card
const InsightCard: React.FC<InsightCardProps> = ({ title, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.2 }}
  >
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-1.5 flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-grow">
          <p className="text-[10px] font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{title}</p>
        </div>
        <ArrowRight className="h-2.5 w-2.5 text-blue-500 flex-shrink-0" />
      </CardContent>
    </Card>
  </motion.div>
);

const FeaturedInsights: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Create insights based on current language
  const getInsights = () => {
    if (language === 'es') {
      return [
        {
          id: 'population-growth',
          title: 'Tendencias de crecimiento poblacional mundial',
          icon: <Users className="h-2.5 w-2.5 text-white" />,
          color: 'bg-gradient-to-r from-purple-500 to-purple-600',
          delay: 0.1
        },
        {
          id: 'economic-centers',
          title: 'Surgimiento de economías emergentes',
          icon: <TrendingUp className="h-2.5 w-2.5 text-white" />,
          color: 'bg-gradient-to-r from-amber-500 to-amber-600',
          delay: 0.2
        },
        {
          id: 'urbanization',
          title: 'Urbanización y sus impactos',
          icon: <Map className="h-2.5 w-2.5 text-white" />,
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
          delay: 0.3
        }
      ];
    } else {
      return [
        {
          id: 'population-growth',
          title: 'Global Population Growth Trends',
          icon: <Users className="h-2.5 w-2.5 text-white" />,
          color: 'bg-gradient-to-r from-purple-500 to-purple-600',
          delay: 0.1
        },
        {
          id: 'economic-centers',
          title: 'Rise of Emerging Economies',
          icon: <TrendingUp className="h-2.5 w-2.5 text-white" />,
          color: 'bg-gradient-to-r from-amber-500 to-amber-600',
          delay: 0.2
        },
        {
          id: 'urbanization',
          title: 'Urbanization and Its Effects',
          icon: <Map className="h-2.5 w-2.5 text-white" />,
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
          delay: 0.3
        }
      ];
    }
  };
  
  const insights = getInsights();
  
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">{t('featuredInsights')}</h3>
      <div className="grid grid-cols-1 gap-1">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            icon={insight.icon}
            color={insight.color}
            delay={insight.delay}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedInsights;
