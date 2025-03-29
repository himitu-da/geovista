
import { TranslationsMap } from './types';
import { commonTranslations } from './common';
import { explorerTranslations } from './explorer';
import { landingTranslations } from './landing';

// 全ての翻訳をマージ
export const translations: TranslationsMap = {
  ...commonTranslations,
  ...explorerTranslations,
  ...landingTranslations
};

export * from './types';
