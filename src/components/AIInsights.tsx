
import React, { useState } from 'react';
import { CountryData, DataMetric } from '@/types/country';
import { Info, MicIcon, Loader2 } from 'lucide-react';

interface AIInsightsProps {
  country: CountryData | undefined;
  metric: DataMetric;
}

const AIInsights: React.FC<AIInsightsProps> = ({ country, metric }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Function to request insights from Claude API (to be implemented with edge function)
  const generateInsights = async () => {
    if (!country) return;
    
    setLoading(true);
    // Placeholder for Claude API integration
    // This would be replaced with actual API call to Anthropic Claude
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate placeholder insights based on the selected metric and country
      let insightText = '';
      
      if (metric === 'population_density') {
        insightText = `${country.name} has a population density of ${Math.round((country.population / (country.area_km2 || 1)))} people per square kilometer. This is ${(country.population / (country.area_km2 || 1)) > 100 ? 'relatively high' : 'relatively low'} compared to global averages, which is often influenced by geographic features and historical settlement patterns.`;
      } else if (metric === 'population') {
        insightText = `With a population of ${country.population.toLocaleString()} people, ${country.name} ranks among the ${country.population > 50000000 ? 'most populous' : 'less populated'} countries in its region. Population trends are often shaped by birth rates, migration patterns, and economic opportunities.`;
      } else if (metric === 'gdp_per_capita') {
        insightText = `${country.name}'s GDP per capita reflects its economic output divided by population. This metric is influenced by factors like natural resources, industrial development, education levels, and trade relationships.`;
      }
      
      setInsight(insightText);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsight('Failed to generate insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to read insights using ElevenLabs (to be implemented with edge function)
  const readInsights = async () => {
    if (!insight) return;
    
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
      // Placeholder for ElevenLabs API integration
      // This would be replaced with actual API call

      // Simulate audio playback
      const audioElement = new Audio('https://elevenlabs.io/audio/sample.mp3');
      setAudio(audioElement);
      
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Info className="mr-2 h-4 w-4 text-blue-500" />
          AI Insights
        </h3>
        {!insight && (
          <button
            onClick={generateInsights}
            disabled={loading || !country}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-3 w-3 mr-1" /> 
                Generating...
              </span>
            ) : (
              'Generate Insights'
            )}
          </button>
        )}
      </div>
      
      {insight ? (
        <div className="text-sm text-gray-600">
          <p className="mb-2">{insight}</p>
          <button
            onClick={readInsights}
            className="flex items-center text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1 px-2 rounded transition-colors"
          >
            <MicIcon className="h-3 w-3 mr-1" />
            {isPlaying ? 'Pause' : 'Listen'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic">
          {country ? 'Click "Generate Insights" to get AI-powered analysis about this country.' : 'Select a country on the map to get AI-powered insights.'}
        </p>
      )}
    </div>
  );
};

export default AIInsights;
