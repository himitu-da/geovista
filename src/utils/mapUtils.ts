
import { DataMetric } from '@/types/country';

/**
 * 指標ごとの色範囲の定義
 * 各指標に対して、値の閾値とそれに対応する色を定義
 */
const COLOR_RANGES = {
  population_density: [
    { threshold: 0, color: '#f5f5f7' },
    { threshold: 10, color: '#d2d2d7' },
    { threshold: 50, color: '#a1a1a6' },
    { threshold: 100, color: '#6e6e73' },
    { threshold: 500, color: '#3a3a3c' },
    { threshold: 1000, color: '#1d1d1f' }
  ],
  population: [
    { threshold: 0, color: '#f5f5f7' },
    { threshold: 1000000, color: '#d2d2d7' },
    { threshold: 10000000, color: '#a1a1a6' },
    { threshold: 50000000, color: '#6e6e73' },
    { threshold: 100000000, color: '#3a3a3c' },
    { threshold: 500000000, color: '#1d1d1f' }
  ],
  gdp_per_capita: [
    { threshold: 0, color: '#f5f5f7' },
    { threshold: 1000, color: '#d2d2d7' },
    { threshold: 5000, color: '#a1a1a6' },
    { threshold: 15000, color: '#6e6e73' },
    { threshold: 30000, color: '#3a3a3c' },
    { threshold: 50000, color: '#1d1d1f' }
  ]
};

// デフォルトの色（値が無い場合）
const DEFAULT_COLOR = '#f5f5f7'; // Appleっぽい明るいグレー

/**
 * 指標値に基づいて色を取得
 * @param value 指標の値
 * @param metric 指標の種類
 * @returns 対応する色のコード
 */
export const getColorForValue = (value: number | null, metric: DataMetric): string => {
  if (value === null) return DEFAULT_COLOR;
  
  const ranges = COLOR_RANGES[metric];
  if (!ranges) return DEFAULT_COLOR;
  
  // 値が範囲内にある最後のしきい値の色を見つける
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (value >= ranges[i].threshold) {
      return ranges[i].color;
    }
  }
  
  return DEFAULT_COLOR;
};

/**
 * 凡例の色停止位置を取得
 * @param metric 指標の種類
 * @returns 色停止位置の配列
 */
export const getColorStops = (metric: DataMetric): { value: number; color: string }[] => {
  const ranges = COLOR_RANGES[metric] || COLOR_RANGES.population_density;
  
  // thresholdプロパティをvalueプロパティに変換して返す
  return ranges.map(({ threshold, color }) => ({
    value: threshold,
    color
  }));
};
