
import { supabase } from '@/integrations/supabase/client';

/**
 * 与えられた位置（緯度、経度）に基づいて場所の説明を生成する
 * Gemini AIを使って、その場所の歴史、地理、文化などの情報を取得
 */
export const generateLocationDescription = async (position: [number, number]): Promise<string> => {
  try {
    // 緯度と経度を取得
    const [latitude, longitude] = position;
    
    // モックデータを使う場合（APIが未実装の場合）
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      // 開発環境用のモックレスポンス
      await new Promise(resolve => setTimeout(resolve, 1500)); // 遅延をシミュレート
      
      return `この場所は緯度 ${latitude.toFixed(4)}、経度 ${longitude.toFixed(4)} に位置しています。
この地域は美しい自然景観と豊かな文化遺産で知られています。周辺には山脈や湖があり、四季折々の風景を楽しむことができます。
地元の人々は伝統的な祭りを大切にしており、毎年多くの観光客がこの地域を訪れます。また、この地域の料理は独特の風味で、
地元の食材を使った伝統的な料理が楽しめます。歴史的には、古くから交易の中心地として栄え、
いくつかの重要な歴史的建造物が残されています。`;
    }
    
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
