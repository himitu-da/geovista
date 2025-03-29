
import { supabase } from '@/integrations/supabase/client';

/**
 * 位置情報（緯度、経度）に基づいた場所の説明を生成
 * GeminiAIを使用して、歴史、地理、文化などの情報を含む場所の説明を取得
 */
export const generateLocationDescription = async (position: [number, number], language: string = 'en'): Promise<string> => {
  try {
    // 緯度と経度を取得
    const [latitude, longitude] = position;
    
    // Supabaseエッジ関数を呼び出して説明を生成
    const { data, error } = await supabase.functions.invoke('generate-location-description', {
      body: { latitude, longitude, language }
    });
    
    if (error) {
      console.error('エッジ関数呼び出しエラー:', error);
      
      // 言語に応じたエラーメッセージを返す
      if (language === 'ja') {
        throw new Error('AI説明の生成に失敗しました');
      } else if (language === 'es') {
        throw new Error('Error al generar descripción con IA');
      } else {
        throw new Error('Failed to generate AI description');
      }
    }
    
    return data.description;
  } catch (error) {
    console.error('場所の説明生成エラー:', error);
    throw error;
  }
};
