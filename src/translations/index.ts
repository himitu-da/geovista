
import { TranslationsMap } from './types';
import { commonTranslations } from './common';
import { explorerTranslations } from './explorer';
import { landingTranslations } from './landing';

// Merge all translations
export const translations: TranslationsMap = {
  ...commonTranslations,
  ...explorerTranslations,
  // Convert landingTranslations to TranslationsMap format
  ...Object.entries(landingTranslations.en).reduce<Record<string, { en: string; es: string }>>((acc, [key, value]) => {
    acc[key] = {
      en: landingTranslations.en[key],
      es: landingTranslations.es[key]
    };
    return acc;
  }, {})
};

export * from './types';
