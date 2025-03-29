
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountryData, DataMetric } from '@/types/country';
import { Loader2 } from 'lucide-react';

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
      return `${value.toFixed(1)} people/km²`;
    }
    if (selectedMetric === 'gdp_per_capita') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  // Get label for metric
  const getMetricLabel = () => {
    if (selectedMetric === 'population_density') return 'Population Density (people/km²)';
    if (selectedMetric === 'gdp_per_capita') return 'GDP Per Capita (USD)';
    return 'Total Population';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
          <p className="text-blue-500 font-medium">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-gray-500">No data available for the selected metric.</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {getMetricLabel()} - Top 20 Countries
      </h3>
      <div className="h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 'auto']} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              width={90}
            />
            <Tooltip 
              formatter={(value: number) => [formatValue(value), getMetricLabel()]}
            />
            <Bar dataKey="value" fill="#4F86C6" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell 
                  key={entry.id} 
                  fill={entry.id === selectedCountry ? '#2563EB' : '#4F86C6'} 
                  opacity={selectedCountry && entry.id !== selectedCountry ? 0.5 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataChart;
