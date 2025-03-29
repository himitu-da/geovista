
import { DataMetric } from '@/types/country';

/**
 * 指標値に基づいて色を取得（単純化）
 * すべての国に同じ色を適用
 */
export const getColorForValue = (value: number | null, metric: DataMetric): string => {
  return '#e8e8e8'; // デフォルトの色
};

/**
 * 凡例の色停止位置を取得
 * @param metric 指標の種類
 * @returns 色停止位置の配列
 */
export const getColorStops = (metric: DataMetric): { value: number; color: string }[] => {
  return [
    { value: 0, color: '#e8e8e8' }
  ];
};
