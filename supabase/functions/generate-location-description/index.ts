
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
    
    // モック開発のための簡易的な実装
    // 実際の実装では、ここにOpenAI APIやAnthropicのClaude APIを使用して、
    // 与えられた緯度・経度に基づいて場所の説明を生成するコードが入ります
    
    // 緯度・経度に基づいてモックの説明を生成
    const description = await mockGenerateDescription(latitude, longitude);
    
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

/**
 * モック：緯度・経度に基づいて場所の説明を生成
 * 注：実際にはClaudeやGPT-4などのAI APIを使用して生成することを想定
 */
async function mockGenerateDescription(latitude: number, longitude: number): Promise<string> {
  // 実際のAPIを使用する場合、ここを置き換える
  // 緯度経度に基づいて少し変化をつける
  const regionKey = getRegionKey(latitude, longitude);
  return MOCK_DESCRIPTIONS[regionKey] || MOCK_DESCRIPTIONS.default;
}

/**
 * 緯度・経度に基づいて大まかな地域を判定
 */
function getRegionKey(latitude: number, longitude: number): string {
  // 非常に簡略化した地域判定
  if (latitude > 0) {
    return longitude > 0 ? 'northeast' : 'northwest';
  } else {
    return longitude > 0 ? 'southeast' : 'southwest';
  }
}

// モック用の地域別説明
const MOCK_DESCRIPTIONS: Record<string, string> = {
  northeast: `この地域は北東部に位置し、四季折々の美しい風景が楽しめます。春には桜が咲き誇り、夏は緑豊かな森林、秋には紅葉、冬には雪景色が広がります。伝統的な文化と現代的な都市が融合したこの地域では、古くからの祭りや伝統工芸が今も大切に守られています。地元の料理は季節の食材を活かした繊細な味わいが特徴です。`,
  
  northwest: `北西部に位置するこの地域は、雄大な山々と深い森林に囲まれています。自然保護区や国立公園が多く、希少な野生動物が生息しています。地域の文化は自然との共生を重んじ、環境に配慮した持続可能な生活様式が特徴です。伝統的な木造建築や石造りの建物が今も残り、歴史的な景観を形成しています。`,
  
  southeast: `南東部のこの地域は温暖な気候に恵まれ、豊かな農業地帯が広がっています。果樹園やワイナリーが点在し、地元産の新鮮な食材を使った料理が楽しめます。沿岸部では漁業も盛んで、新鮮な海産物が地域の食文化を支えています。歴史的には海洋貿易の拠点として栄え、多様な文化が融合した独自の伝統が形成されています。`,
  
  southwest: `南西部に位置するこの地域は、乾燥した気候と特徴的な地形が印象的です。砂漠や渓谷などの壮大な自然景観が広がり、星空観測の名所としても知られています。先住民の文化が色濃く残るこの地域では、伝統的な芸術や工芸品が今も作られています。スパイスを効かせた独特の料理や、地域特有の建築様式も見どころのひとつです。`,
  
  default: `この場所は緯度 ${latitude.toFixed(4)}、経度 ${longitude.toFixed(4)} に位置しています。周辺地域には独自の文化や歴史があり、地元の人々の生活様式や伝統が今も守られています。この地域特有の自然環境は、そこに住む人々の文化や産業に大きな影響を与えてきました。訪れる価値のある場所として、地元の料理や工芸品、歴史的建造物などの観光スポットがあります。`
};
