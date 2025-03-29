
import { DataMetric } from '@/types/country';

/**
 * 指標ごとの色範囲の定義
 * 各指標に対して、値の閾値とそれに対応する色を定義
 */
const COLOR_RANGES = {
  population_density: [
    { threshold: 0, color: '#E8F5E9' },    // 明るい緑
    { threshold: 10, color: '#C8E6C9' },   // 薄緑
    { threshold: 50, color: '#A5D6A7' },   // 中緑
    { threshold: 100, color: '#81C784' },  // 濃い緑
    { threshold: 500, color: '#66BB6A' },  // さらに濃い緑
    { threshold: 1000, color: '#4CAF50' }  // 最も濃い緑
  ],
  population: [
    { threshold: 0, color: '#E3F2FD' },    // 明るい青
    { threshold: 1000000, color: '#BBDEFB' },   // 薄青
    { threshold: 10000000, color: '#90CAF9' },  // 中青
    { threshold: 50000000, color: '#64B5F6' },  // 濃い青
    { threshold: 100000000, color: '#42A5F5' }, // さらに濃い青
    { threshold: 500000000, color: '#2196F3' }  // 最も濃い青
  ],
  gdp_per_capita: [
    { threshold: 0, color: '#FFF3E0' },    // 明るいオレンジ
    { threshold: 1000, color: '#FFE0B2' },   // 薄オレンジ
    { threshold: 5000, color: '#FFCC80' },   // 中オレンジ
    { threshold: 15000, color: '#FFB74D' },  // 濃いオレンジ
    { threshold: 30000, color: '#FFA726' },  // さらに濃いオレンジ
    { threshold: 50000, color: '#FF9800' }   // 最も濃いオレンジ
  ]
};

// デフォルトの色（値が無い場合）
const DEFAULT_COLOR = '#F5F5F5'; // 明るいグレー

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
