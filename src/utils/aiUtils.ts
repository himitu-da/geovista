
import { supabase } from '@/integrations/supabase/client';

/**
 * 与えられた位置（緯度、経度）に基づいて場所の説明を生成する
 * Gemini AIを使って、その場所の歴史、地理、文化などの情報を取得
 */
export const generateLocationDescription = async (position: [number, number]): Promise<string> => {
  try {
    // 緯度と経度を取得
    const [latitude, longitude] = position;
    
    // Supabaseエッジ関数を呼び出して説明を生成
    const { data, error } = await supabase.functions.invoke('generate-location-description', {
      body: { latitude, longitude }
    });
    
    if (error) {
      console.error('Error calling edge function:', error);
      throw new Error('AIによる説明生成に失敗しました');
    }
    
    return data.description;
  } catch (error) {
    console.error('Error generating location description:', error);
    throw error;
  }
};
