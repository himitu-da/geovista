
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend as RechartsLegend } from 'recharts';
import { CountryData, DataMetric } from '@/types/country';
import { Loader2, BarChart3, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataChartProps {
  countries: CountryData[];
  loading: boolean;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
}

const DataChart: React.FC<DataChartProps> = ({
  countries,
  loading,
  selectedMetric,
  selectedCountry
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!countries.length) return [];

    // Filter out countries with missing data for the selected metric
    let filteredCountries = countries.filter(country => {
      if (selectedMetric === 'population_density') {
        return country.population > 0 && country.area_km2 && country.area_km2 > 0;
      }
      if (selectedMetric === 'gdp_per_capita') {
        return country.gdp_per_capita !== undefined && country.gdp_per_capita > 0;
      }
      return country.population > 0;
    });

    // Sort countries by the selected metric
    filteredCountries.sort((a, b) => {
      if (selectedMetric === 'population_density') {
        const densityA = a.population / (a.area_km2 || 1);
        const densityB = b.population / (b.area_km2 || 1);
        return densityB - densityA;
      }
      if (selectedMetric === 'gdp_per_capita') {
        return (b.gdp_per_capita || 0) - (a.gdp_per_capita || 0);
      }
      return b.population - a.population;
    });

    // Take top 20 countries
    const topCountries = filteredCountries.slice(0, 20);

    // Format data for chart
    return topCountries.map(country => {
      let value: number;
      
      if (selectedMetric === 'population_density') {
        value = country.population / (country.area_km2 || 1);
      } else if (selectedMetric === 'gdp_per_capita') {
        value = country.gdp_per_capita || 0;
      } else {
        value = country.population;
      }
      
      return {
        id: country.id,
        name: country.name,
        value: value
      };
    });
  }, [countries, selectedMetric]);

  // Format value for tooltip
  const formatValue = (value: number) => {
    if (selectedMetric === 'population_density') {
      return `${value.toFixed(1)} 人/km²`;
    }
    if (selectedMetric === 'gdp_per_capita') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString() + ' 人';
  };

  // Get label for metric
  const getMetricLabel = () => {
    if (selectedMetric === 'population_density') return '人口密度 (人/km²)';
    if (selectedMetric === 'gdp_per_capita') return '一人当たりGDP (USD)';
    return '総人口';
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-3">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">{getMetricLabel()}: <span className="font-medium">{formatValue(data.value)}</span></p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
          <p className="text-blue-500 font-medium">チャートデータを読み込み中...</p>
        </motion.div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">選択した指標のデータがありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-800">
          {getMetricLabel()} - 上位20カ国
        </h3>
      </motion.div>
      
      <div className="h-[calc(100%-3.5rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            onMouseMove={(data) => {
              if (data.activePayload) {
                setHoveredCountry(data.activePayload[0].payload.id);
              }
            }}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              domain={[0, 'auto']} 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={{ stroke: '#ddd' }}
              axisLine={{ stroke: '#ddd' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#666' }}
              width={100}
              tickLine={{ stroke: '#ddd' }}
              axisLine={{ stroke: '#ddd' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => {
                const isSelected = entry.id === selectedCountry;
                const isHovered = entry.id === hoveredCountry;
                
                return (
                  <Cell 
                    key={entry.id} 
                    fill={isSelected ? '#2563EB' : (isHovered ? '#60A5FA' : '#93C5FD')}
                    opacity={selectedCountry && !isSelected && !isHovered ? 0.5 : 1}
                    strokeWidth={isSelected || isHovered ? 2 : 0}
                    stroke={isSelected ? '#1E40AF' : (isHovered ? '#2563EB' : 'none')}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataChart;
