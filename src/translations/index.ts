
import { TranslationsMap } from './types';
import { commonTranslations } from './common';
import { explorerTranslations } from './explorer';
import { landingTranslations } from './landing';

// 全ての翻訳をマージ
export const translations: TranslationsMap = {
  ...commonTranslations,
  ...explorerTranslations,
  // landingTranslations を TranslationsMap 形式に変換
  ...Object.entries(landingTranslations.en).reduce<Record<string, { en: string; ja: string }>>((acc, [key, value]) => {
    acc[key] = {
      en: landingTranslations.en[key],
      ja: landingTranslations.ja[key]
    };
    return acc;
  }, {})
};

export * from './types';
