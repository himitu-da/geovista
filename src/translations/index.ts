
import { TranslationsMap, Translations } from './types';
import { commonTranslations } from './common';
import { explorerTranslations } from './explorer';
import { landingTranslations } from './landing';

// Merge all translations
export const translations: Translations = {
  ...commonTranslations,
  ...explorerTranslations,
  // Convert landingTranslations to Translations format
  ...Object.entries(landingTranslations.en).reduce<Record<string, { en: string; es: string; ja: string }>>((acc, [key, value]) => {
    acc[key] = {
      en: landingTranslations.en[key as keyof typeof landingTranslations.en],
      es: landingTranslations.es[key as keyof typeof landingTranslations.es],
      ja: landingTranslations.ja[key as keyof typeof landingTranslations.ja]
    };
    return acc;
  }, {})
};

export * from './types';
