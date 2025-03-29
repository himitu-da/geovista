
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * アプリケーションの情報セクションコンポーネント
 * アプリ概要と使用手順を表示
 */
const SidebarInfoSection: React.FC = () => {
  const { t, language } = useLanguage();
  
  // 言語に基づいてコンテンツを表示
  const getContent = () => {
    if (language === 'ja') {
      return (
        <>
          <p className="mb-2">世界の地理データを探索するためのインタラクティブなプラットフォームへようこそ。</p>
          <p className="mb-2">このアプリでは、様々な国のデータを比較し、グローバルトレンドを発見できます。</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>マップビューでは地理的データを視覚化</li>
            <li>チャートビューでは主要指標をグラフで表示</li>
            <li>AI洞察機能で隠れたパターンを発見</li>
          </ul>
        </>
      );
    } else {
      return (
        <>
          <p className="mb-2">{t('aboutTheApp')}</p>
          <p className="mb-2">{t('compareCountries')}</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>{t('mapView')}</li>
            <li>{t('chartView')}</li>
            <li>{t('aiInsightFeature')}</li>
          </ul>
        </>
      );
    }
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-3 text-sm text-gray-600">
        {getContent()}
      </CardContent>
    </Card>
  );
};

export default SidebarInfoSection;
