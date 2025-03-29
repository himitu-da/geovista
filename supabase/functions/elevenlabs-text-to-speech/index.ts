
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORSプリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice_id, model_id, language } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // ElevenLabs APIキーを環境変数から取得
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      throw new Error('ElevenLabs API key not found')
    }

    // デフォルトの声とモデルを設定
    const defaultVoices = {
      en: 'pFZP5JQG7iQjIQuC4Bku', // Lily
      es: 'pqHfZKP75CvOlQylNhV4', // Bill
      ja: 'XB0fDUnXU5powFXDhCwa', // Charlotte
    }
    
    // 言語に基づいて適切な声を選択
    const selectedVoiceId = voice_id || (language && defaultVoices[language]) || defaultVoices.en
    const selectedModelId = model_id || 'eleven_multilingual_v2'

    // ElevenLabs APIを呼び出して音声を生成
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: selectedModelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
      console.error('ElevenLabs API error:', errorData)
      throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`)
    }

    // 音声データを取得
    const audioArrayBuffer = await response.arrayBuffer()
    
    // Base64エンコード
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    )

    return new Response(
      JSON.stringify({ 
        audio: audioBase64,
        format: 'mp3',
        voice_id: selectedVoiceId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error generating speech:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate speech' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
