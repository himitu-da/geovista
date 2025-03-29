
import { supabase } from '@/integrations/supabase/client';

// 言語ごとのデフォルトの声ID
export const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (英語)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (スペイン語)
  ja: 'XB0fDUnXU5powFXDhCwa', // Charlotte (日本語)
};

// テキストから音声を生成する関数
export const generateSpeech = async (
  text: string, 
  language: string = 'en'
): Promise<string | null> => {
  try {
    // テキストを120字以下のチャンクに分割（APIの制限対策）
    const chunks = splitTextIntoChunks(text, 4000);
    
    if (chunks.length === 0) return null;
    
    // 最初のチャンクのみ読み上げる（APIコスト削減のため）
    const firstChunk = chunks[0];
    
    // Supabaseエッジ関数を呼び出して音声を生成
    const { data, error } = await supabase.functions.invoke('elevenlabs-text-to-speech', {
      body: { 
        text: firstChunk,
        language: language,
        voice_id: VOICE_IDS[language] || VOICE_IDS.en
      }
    });
    
    if (error) {
      console.error('Failed to generate speech:', error);
      return null;
    }
    
    return data.audio; // Base64エンコードされた音声データ
  } catch (error) {
    console.error('Error in speech generation:', error);
    return null;
  }
};

// テキストを指定されたサイズのチャンクに分割する関数
const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
  if (!text) return [];
  
  const chunks: string[] = [];
  
  // 文章単位で分割するために、ピリオドや句点で分ける
  const sentences = text.split(/(?<=[.。!?！？])\s*/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      // 新しい文が長すぎる場合は再分割
      if (sentence.length > maxLength) {
        const words = sentence.split(' ');
        currentChunk = '';
        
        for (const word of words) {
          if (currentChunk.length + word.length + 1 <= maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + word;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            currentChunk = word;
          }
        }
      } else {
        currentChunk = sentence;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

// 音声を再生する関数
export const playSpeech = (audioBase64: string): HTMLAudioElement => {
  const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
  audio.play();
  return audio;
};
