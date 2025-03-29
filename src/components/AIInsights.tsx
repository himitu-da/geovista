
import React, { useState } from 'react';
import { CountryData, DataMetric } from '@/types/country';
import { Lightbulb } from 'lucide-react';
import InsightGenerator from './ai/InsightGenerator';
import InsightReader from './ai/InsightReader';
import { motion, AnimatePresence } from 'framer-motion';

// インサイトジェネレーターの遅延時間（ミリ秒）
const INSIGHT_GENERATION_DELAY = 1500;

interface AIInsightsProps {
  country: CountryData | undefined;
  metric: DataMetric;
}

/**
 * AIインサイトコンポーネント
 * 選択された国と指標に基づいてAI生成のインサイトを表示
 */
const AIInsights: React.FC<AIInsightsProps> = ({ country, metric }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  /**
   * Claude APIからインサイトをリクエストする関数（エッジ関数で実装予定）
   */
  const generateInsights = async () => {
    if (!country) return;
    
    setLoading(true);
    
    try {
      // API呼び出しの遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, INSIGHT_GENERATION_DELAY));
      
      // 選択されたメトリックと国に基づくプレースホルダーインサイトを生成
      const insightText = generatePlaceholderInsight(country, metric);
      setInsight(insightText);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsight('インサイトの生成に失敗しました。後でもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 指標タイプに基づいてプレースホルダーのインサイトテキストを生成
   */
  const generatePlaceholderInsight = (country: CountryData, metric: DataMetric): string => {
    switch (metric) {
      case 'population_density':
        return `${country.name}の人口密度は1平方キロメートルあたり${Math.round((country.population / (country.area_km2 || 1)))}人です。これは世界平均と比較して${(country.population / (country.area_km2 || 1)) > 100 ? '比較的高い' : '比較的低い'}値であり、地理的特徴や歴史的な居住パターンに影響されています。`;
      
      case 'population':
        return `${country.population.toLocaleString()}人の人口を持つ${country.name}は、その地域の${country.population > 50000000 ? '最も人口が多い' : '人口が少ない'}国々の中に位置しています。人口動向は出生率、移民パターン、経済的機会によって形成されることがよくあります。`;
      
      case 'gdp_per_capita':
        return `${country.name}の一人当たりGDPは、人口で割った経済生産を反映しています。この指標は天然資源、産業発展、教育レベル、貿易関係などの要因に影響されます。`;
      
      default:
        return '選択された指標に関する情報は現在利用できません。';
    }
  };

  /**
   * ElevenLabsを使用してインサイトを読み上げる関数（エッジ関数で実装予定）
   */
  const toggleAudio = async () => {
    if (!insight) return;
    
    // 既存のオーディオがある場合は再生/一時停止を切り替え
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }
    
    try {
      setIsPlaying(true);
      // ElevenLabs APIの統合のプレースホルダー

      // オーディオ再生をシミュレート
      const audioElement = new Audio('https://elevenlabs.io/audio/sample.mp3');
      setAudio(audioElement);
      
      // イベントリスナーの設定
      audioElement.onended = () => {
        setIsPlaying(false);
      };
      
      audioElement.onerror = () => {
        setIsPlaying(false);
        console.error('Error playing audio');
      };
      
      audioElement.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
          AIインサイト
        </h3>
        
        <InsightGenerator 
          country={country}
          metric={metric}
          loading={loading}
          insight={insight}
          onGenerate={generateInsights}
        />
      </div>
      
      <InsightContent 
        insight={insight}
        country={country}
        isPlaying={isPlaying}
        onTogglePlay={toggleAudio}
      />
    </motion.div>
  );
};

interface InsightContentProps {
  insight: string;
  country: CountryData | undefined;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

/**
 * インサイトコンテンツコンポーネント
 * インサイトの表示とプロンプトメッセージを切り替え
 */
const InsightContent: React.FC<InsightContentProps> = ({ 
  insight, 
  country, 
  isPlaying, 
  onTogglePlay 
}) => (
  <AnimatePresence mode="wait">
    {insight ? (
      <motion.div 
        key="insight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-sm text-gray-600"
      >
        <p className="mb-3 leading-relaxed">{insight}</p>
        <InsightReader 
          insight={insight}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
        />
      </motion.div>
    ) : (
      <motion.p 
        key="prompt"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xs text-gray-500 italic"
      >
        {country 
          ? '「インサイトを生成」をクリックして、この国に関するAI駆動の分析を取得します。' 
          : '地図上で国を選択して、AI駆動のインサイトを取得します。'
        }
      </motion.p>
    )}
  </AnimatePresence>
);

export default AIInsights;
