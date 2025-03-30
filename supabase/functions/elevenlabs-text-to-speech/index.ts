// supabase/functions/elevenlabs-text-to-speech/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ELEVENLABS_API_URL = "https://api.elevenlabs.io";
const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY") || "";

// Default voice IDs per language
const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (English)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (Spanish)
};

interface RequestBody {
  text: string;
  language: string;
  voice_id?: string;
}

serve(async (req: Request) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Check API key first
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error: ElevenLabs API key not configured' }),
        { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const requestData: RequestBody = await req.json();
    
    if (!requestData.text) {
      return new Response(
        JSON.stringify({ error: 'No text provided for TTS generation' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Select the voice ID based on language
    const language = requestData.language || 'en';
    const voice_id = requestData.voice_id || VOICE_IDS[language as keyof typeof VOICE_IDS] || VOICE_IDS.en;
    
    // Limit text length for performance/cost reasons
    const text = requestData.text.substring(0, 1000);

    // Use the with-timestamps endpoint to get timing data
    const elevenlabsUrl = `${ELEVENLABS_API_URL}/v1/text-to-speech/${voice_id}/with-timestamps`;

    // Make request to ElevenLabs API
    const response = await fetch(elevenlabsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
          details: errorData
        }),
        { status: response.status, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Get response data from ElevenLabs
    const elevenlabsData = await response.json();
    
    // Return the audio and alignment data
    return new Response(
      JSON.stringify({
        audio: elevenlabsData.audio_base64,
        alignment: elevenlabsData.alignment,
        normalized_alignment: elevenlabsData.normalized_alignment
      }),
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Error generating speech: ' + error.message }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
});