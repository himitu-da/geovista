
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();
    
    // Gemini APIキーを取得
    const apiKey = Deno.env.get('CLAUDE_API_KEY');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Gemini APIのエンドポイント
    const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
    
    // 位置情報に基づいて生成するプロンプト
    const prompt = `
    緯度: ${latitude}、経度: ${longitude} にある場所について詳細に説明してください。
    以下の構造で回答を提供してください：

    - タイトル: この場所の簡潔な名称または地域名
    - 概要: この場所の短い概要（1-2文）
    - 地理: この場所の地理的特徴について（2-3文）
    - 歴史: この場所の歴史的背景（2-3文）
    - 文化: この地域の文化的特徴（2-3文）
    - 見どころ: 観光名所や訪問すべき場所（箇条書きで3つ）

    各セクションを明確に分け、マークダウン形式で構造化してください。
    回答は日本語で、合計で400文字程度でお願いします。
    `;

    // Gemini APIリクエスト
    console.log("Sending request to Gemini API with prompt:", prompt);
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data));
    
    // レスポンスからテキストを抽出
    let description = "説明を生成できませんでした。";
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) {
      description = data.candidates[0].content.parts[0].text;
    }
    
    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
