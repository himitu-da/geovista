
// 言語タイプ
export type Language = 'en' | 'ja';

// 翻訳レコード型
export type TranslationRecord = {
  en: string;
  ja: string;
};

// 翻訳全体のマップ型
export type TranslationsMap = Record<string, TranslationRecord>;
