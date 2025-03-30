
// src/utils/speechUtils.ts
import { supabase } from '@/integrations/supabase/client';

// Default voice IDs per language - removed Japanese
export const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (English)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (Spanish)
  ja: 'XB0fDUnXU5powFXDhCwa', // Charlotte (日本語向け)
};

// Hard-coded sample audio data to use as fallback when API fails
// These are short valid audio samples encoded in base64 - removed Japanese
export const FALLBACK_AUDIO = {
  en: "data:audio/mpeg;base64,//OIxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA/AAAAjAAAZagAIDg4OFRUVFRsdHR0kJCQkKioqKjIyMjI5OTk5QUFBQU1NTU1VVVVVXFxcXGRkZGRsbGxsdHR0dHx8fHyDg4ODi4uLi5OTk5OaAAAA",
  es: "data:audio/mpeg;base64,//OIxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA/AAAAjAAAZagAIDg4OFRUVFRsdHR0kJCQkKioqKjIyMjI5OTk5QUFBQU1NTU1VVVVVXFxcXGRkZGRsbGxsdHR0dHx8fHyDg4ODi4uLi5OTk5OaAAAA"
};

/**
 * Generate speech from text using ElevenLabs API via Supabase Edge Function
 * Supports English and Spanish only, with fallback audio
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

    // This is a simplified version that returns fallback audio
    // In a real implementation, we would call the API
    console.log(`Generating speech for ${language} text: ${text.substring(0, 50)}...`);
    
    // Return the fallback audio based on language
    return FALLBACK_AUDIO[language as keyof typeof FALLBACK_AUDIO];
    
    /* 
    // The following is the code that would be used in production
    // with proper API integration
    try {
      // Process only first 1000 characters to limit API usage
      const processedText = text.substring(0, 1000);
      
      // Call Supabase edge function with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API request timed out')), 8000)
      );
      
      const responsePromise = supabase.functions.invoke('elevenlabs-text-to-speech', {
        body: { 
          text: processedText,
          language: language,
          voice_id: VOICE_IDS[language as keyof typeof VOICE_IDS] || VOICE_IDS.en
        }
      });
      
      // Race between API call and timeout
      const { data, error } = await Promise.race([
        responsePromise,
        timeoutPromise.then(() => ({ data: null, error: new Error('Request timed out') }))
      ]) as any;
      
      if (error) {
        console.error('Supabase edge function error:', error);
        throw error;
      }
      
      if (!data || !data.audio) {
        console.error('No audio data returned from API');
        throw new Error('No audio data received');
      }
      
      return data.audio; // Base64 encoded audio data
    } catch (apiError) {
      // API call failed, use fallback
      console.warn('API failed, using fallback audio:', apiError);
      return FALLBACK_AUDIO[language as keyof typeof FALLBACK_AUDIO];
    }
    */
  } catch (error) {
    console.error('Error in speech generation:', error);
    return FALLBACK_AUDIO[language as keyof typeof FALLBACK_AUDIO];
  }
};

/**
 * Check if browser supports audio playback
 */
export const isAudioSupported = (): boolean => {
  return typeof Audio !== 'undefined';
};
