
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, TrendingUp, Map, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Card className="h-full border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className={`pb-2 ${color}`}>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <CardTitle className="text-lg mb-2">{title}</CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <button className="text-xs font-medium flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <span>詳細を見る</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </CardFooter>
    </Card>
  </motion.div>
);

const FeaturedInsights: React.FC = () => {
  const { t } = useLanguage();
  
  const insights = [
    {
      id: 'population-growth',
      title: '世界の人口増加傾向',
      description: '2010年から2020年にかけての地域別人口変動と今後の予測',
      icon: <Users className="h-4 w-4 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      delay: 0.1
    },
    {
      id: 'economic-centers',
      title: '新興経済国の台頭',
      description: '過去10年間でGDP成長率が最も高い国とその経済的影響',
      icon: <TrendingUp className="h-4 w-4 text-white" />,
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      delay: 0.2
    },
    {
      id: 'urbanization',
      title: '都市化の進行と影響',
      description: '急速に都市化が進む地域と、それに伴う社会経済的変化',
      icon: <Map className="h-4 w-4 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      delay: 0.3
    }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{t('featuredInsights')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
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
