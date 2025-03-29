// supabase/functions/elevenlabs-text-to-speech/index.ts

// @deno-types="https://deno.land/x/types/index.d.ts"
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Get ElevenLabs API key from environment variable
// Using type assertion to avoid TypeScript errors
const ELEVENLABS_API_KEY = (Deno as any).env.get('ELEVENLABS_API_KEY');

// Log key status (not the actual key) for debugging
console.log(`ElevenLabs API key status: ${ELEVENLABS_API_KEY ? 'Found' : 'Not found'}`);

// API base URL
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

/**
 * Edge function to handle text-to-speech requests to ElevenLabs
 * Acts as a proxy to keep API keys secure on the server side
 */
serve(async (req) => {
  try {
    console.log("Function called with method:", req.method);
    
    // CORS headers for development
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // Verify request method is POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers }
      );
    }

    // Check if API key is configured
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers }
      );
    }

    // Parse request body
    const requestData = await req.json();
    console.log("Request received with data:", JSON.stringify({
      text_length: requestData.text?.length || 0,
      voice_id: requestData.voice_id || 'default',
      language: requestData.language || 'default'
    }));
    
    // Validate required fields
    if (!requestData.text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers }
      );
    }

    // Get parameters from request or use defaults
    const {
      text,
      voice_id = 'pFZP5JQG7iQjIQuC4Bku', // Default to Lily (English)
      model_id = 'eleven_turbo_v2',
      language = 'en'
    } = requestData;

    // Trim text to a reasonable length if needed (ElevenLabs has limits)
    const MAX_TEXT_LENGTH = 2000;
    const trimmedText = text.length > MAX_TEXT_LENGTH ? 
      text.substring(0, MAX_TEXT_LENGTH) + "..." : 
      text;

    // Prepare the API request to ElevenLabs
    const elevenlabsRequest = {
      text: trimmedText,
      model_id: model_id,
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75
      }
    };

    console.log("Sending request to ElevenLabs API...");
    
    // Make the API call to ElevenLabs with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/text-to-speech/${voice_id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify(elevenlabsRequest),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle API response
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs API error (${response.status}):`, errorText);
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate speech', 
            status: response.status,
            details: errorText
          }),
          { status: 500, headers }
        );
      }

      // Get audio data and convert to base64
      const audioBuffer = await response.arrayBuffer();
      
      // Safe base64 encoding
      let audioBase64;
      try {
        audioBase64 = btoa(
          Array.from(new Uint8Array(audioBuffer))
            .map(byte => String.fromCharCode(byte))
            .join('')
        );
      } catch (encodeError) {
        console.error('Error encoding audio to base64:', encodeError);
        return new Response(
          JSON.stringify({ error: 'Failed to encode audio data' }),
          { status: 500, headers }
        );
      }

      console.log("Successfully generated audio, size:", audioBase64.length);

      // Return success response with audio data
      return new Response(
        JSON.stringify({ audio: audioBase64 }),
        { status: 200, headers }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Request to ElevenLabs timed out');
        return new Response(
          JSON.stringify({ error: 'Request timed out' }),
          { status: 504, headers }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in ElevenLabs edge function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
});