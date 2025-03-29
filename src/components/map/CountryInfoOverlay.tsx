
import React from 'react';
import { motion } from 'framer-motion';
import { CountryData } from '@/types/country';
import { X } from 'lucide-react';

interface CountryInfoOverlayProps {
  countries: CountryData[];
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}

/**
 * 選択された国の詳細情報を表示するオーバーレイコンポーネント
 * 国の基本情報（人口、面積など）を表示し、閉じる機能を提供
 */
const CountryInfoOverlay: React.FC<CountryInfoOverlayProps> = ({
  countries,
  selectedCountry,
  onCountrySelect
}) => {
  // 選択された国のデータを取得
  const country = countries.find(c => c.id === selectedCountry);
  
  // 選択された国がない場合は何も表示しない
  if (!country) return null;
  
  // モーションアニメーションの設定
  const animationConfig = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };
  
  // 閉じるボタンのハンドラー
  const handleClose = () => onCountrySelect(null);
  
  return (
    <motion.div 
      {...animationConfig}
      className="absolute left-4 bottom-4 z-[400] bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2.5 max-w-xs"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-sm text-gray-800">
          {country.name}
        </h3>
        <button 
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
      <div className="text-xs text-gray-600">
        {renderCountryDetail(country)}
      </div>
    </motion.div>
  );
};

/**
 * 国の詳細情報を表示する関数
 * 人口や面積などが存在する場合のみ表示
 */
const renderCountryDetail = (country: CountryData) => {
  return (
    <>
      {country.population && (
        <p>人口: {country.population.toLocaleString()}</p>
      )}
      {country.area_km2 && (
        <p>面積: {country.area_km2.toLocaleString()} km²</p>
      )}
    </>
  );
};

export default CountryInfoOverlay;
