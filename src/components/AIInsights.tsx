
import React, { useState } from 'react';
import { CountryData, DataMetric } from '@/types/country';
import { Lightbulb } from 'lucide-react';
import InsightGenerator from './ai/InsightGenerator';
import InsightReader from './ai/InsightReader';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// Insight generation delay (milliseconds)
const INSIGHT_GENERATION_DELAY = 1500;

interface AIInsightsProps {
  country: CountryData | undefined;
  metric: DataMetric;
}

/**
 * AI Insights component
 * Displays AI-generated insights based on selected country and metric
 */
const AIInsights: React.FC<AIInsightsProps> = ({ country, metric }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { language } = useLanguage();

  /**
   * Request insights from Claude API (to be implemented with edge function)
   */
  const generateInsights = async () => {
    if (!country) return;
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, INSIGHT_GENERATION_DELAY));
      
      // Generate placeholder insight based on selected metric and country
      const insightText = generatePlaceholderInsight(country, metric);
      setInsight(insightText);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsight(language === 'es' 
        ? 'Error al generar insights. Por favor, inténtelo de nuevo más tarde.' 
        : 'Failed to generate insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate placeholder insight text based on metric type
   */
  const generatePlaceholderInsight = (country: CountryData, metric: DataMetric): string => {
    if (language === 'es') {
      switch (metric) {
        case 'population_density':
          return `La densidad de población de ${country.name} es de ${Math.round((country.population / (country.area_km2 || 1)))} personas por kilómetro cuadrado. Este es un valor ${(country.population / (country.area_km2 || 1)) > 100 ? 'relativamente alto' : 'relativamente bajo'} en comparación con el promedio mundial, influenciado por características geográficas y patrones de asentamiento históricos.`;
        
        case 'population':
          return `Con una población de ${country.population.toLocaleString()} personas, ${country.name} se sitúa entre los países ${country.population > 50000000 ? 'más poblados' : 'menos poblados'} de su región. Las tendencias demográficas suelen estar moldeadas por tasas de natalidad, patrones de migración y oportunidades económicas.`;
        
        case 'gdp_per_capita':
          return `El PIB per cápita de ${country.name} refleja la producción económica dividida por la población. Este indicador está influenciado por factores como recursos naturales, desarrollo industrial, niveles educativos y relaciones comerciales.`;
        
        default:
          return 'La información sobre el indicador seleccionado no está disponible actualmente.';
      }
    } else {
      switch (metric) {
        case 'population_density':
          return `${country.name}'s population density is ${Math.round((country.population / (country.area_km2 || 1)))} people per square kilometer. This is a ${(country.population / (country.area_km2 || 1)) > 100 ? 'relatively high' : 'relatively low'} value compared to the world average, influenced by geographical features and historical settlement patterns.`;
        
        case 'population':
          return `With a population of ${country.population.toLocaleString()}, ${country.name} ranks among the ${country.population > 50000000 ? 'most populous' : 'less populous'} countries in its region. Demographic trends are often shaped by birth rates, migration patterns, and economic opportunities.`;
        
        case 'gdp_per_capita':
          return `${country.name}'s GDP per capita reflects economic output divided by population. This indicator is influenced by factors such as natural resources, industrial development, education levels, and trade relationships.`;
        
        default:
          return 'Information about the selected indicator is currently not available.';
      }
    }
  };

  /**
   * Use ElevenLabs to read insight (to be implemented with edge function)
   */
  const toggleAudio = async () => {
    if (!insight) return;
    
    // Toggle existing audio playback if available
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
      // ElevenLabs API integration placeholder

      // Simulate audio playback
      const audioElement = new Audio('https://elevenlabs.io/audio/sample.mp3');
      setAudio(audioElement);
      
      // Set up event listeners
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
          {language === 'es' ? 'Insights de IA' : 'AI Insights'}
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
        language={language}
      />
    </motion.div>
  );
};

interface InsightContentProps {
  insight: string;
  country: CountryData | undefined;
  isPlaying: boolean;
  onTogglePlay: () => void;
  language: string;
}

/**
 * Insight content component
 * Toggles between insight display and prompt message
 */
const InsightContent: React.FC<InsightContentProps> = ({ 
  insight, 
  country, 
  isPlaying, 
  onTogglePlay,
  language
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
          ? (language === 'es' 
              ? 'Haga clic en "Generar insights" para obtener un análisis impulsado por IA de este país.' 
              : 'Click "Generate insights" to get AI-driven analysis for this country.') 
          : (language === 'es'
              ? 'Seleccione un país en el mapa para obtener insights impulsados por IA.'
              : 'Select a country on the map to get AI-driven insights.')
        }
      </motion.p>
    )}
  </AnimatePresence>
);

export default AIInsights;
