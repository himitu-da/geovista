// src/utils/speechUtils.ts
import { supabase } from '@/integrations/supabase/client';

// Voice IDs per language (for reference only - actual selection happens in the edge function)
export const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (English)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (Spanish)
};

/**
 * Interface for text-to-speech response
 */
interface TextToSpeechResponse {
  audio: string; // Base64 encoded audio
  alignment?: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
  normalized_alignment?: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
}

/**
 * Generate speech from text using ElevenLabs API via Supabase Edge Function
 * @param text The text to convert to speech
 * @param language The language code (en, es)
 * @returns Promise with base64 audio data
 */
export const generateSpeech = async (
  text: string, 
  language: string = 'en'
): Promise<string | null> => {
  try {
    // Validate input
    if (!text?.trim()) {
      console.warn('Empty text provided to generateSpeech');
      return null;
    }

    // Only support English and Spanish
    if (language !== 'en' && language !== 'es') {
      language = 'en'; // Default to English for unsupported languages
    }

    console.log(`Generating speech for ${language} text: ${text.substring(0, 50)}...`);
    
    // Process only first 1000 characters to limit API usage
    const processedText = text.substring(0, 1000);
    
    // Create a promise that will reject after a timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('API request timed out')), 12000)
    );
    
    // Make the API call with a timeout
    const responsePromise = supabase.functions.invoke('elevenlabs-text-to-speech', {
      body: { 
        text: processedText,
        language: language
      }
    });
    
    // Race between API call and timeout
    const result = await Promise.race([
      responsePromise,
      timeoutPromise
    ]);
    
    // Handle error from Supabase function
    if (result.error) {
      console.error('Supabase edge function error:', result.error);
      throw new Error(result.error.message || 'Error calling speech service');
    }
    
    // Parse response
    const data = result.data as TextToSpeechResponse;
    
    if (!data || !data.audio) {
      console.error('No audio data returned from API');
      throw new Error('No audio data received');
    }
    
    // Return the base64 audio data
    return data.audio;
    
  } catch (error) {
    console.error('Error in speech generation:', error);
    
    // Re-throw so the caller can handle the error
    throw error;
  }
};

/**
 * Check if browser supports audio playback
 */
export const isAudioSupported = (): boolean => {
  return typeof Audio !== 'undefined';
};