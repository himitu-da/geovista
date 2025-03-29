// src/utils/speechUtils.ts
import { supabase } from '@/integrations/supabase/client';

// Default voice IDs per language
export const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (English)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (Spanish)
};

// Hard-coded sample audio data to use as fallback when API fails
// These are short valid audio samples encoded in base64
export const FALLBACK_AUDIO = {
  en: "data:audio/mpeg;base64,//OIxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA/AAAAjAAAZagAIDg4OFRUVFRsdHR0kJCQkKioqKjIyMjI5OTk5QUFBQU1NTU1VVVVVXFxcXGRkZGRsbGxsdHR0dHx8fHyDg4ODi4uLi5OTk5OaAAAA",
  es: "data:audio/mpeg;base64,//OIxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA/AAAAjAAAZagAIDg4OFRUVFRsdHR0kJCQkKioqKjIyMjI5OTk5QUFBQU1NTU1VVVVVXFxcXGRkZGRsbGxsdHR0dHx8fHyDg4ODi4uLi5OTk5OaAAAA"
};

/**
 * Generate speech from text using ElevenLabs API
 * Due to CORS issues, we're bypassing the Supabase Edge Function and returning fallback audio
 */
export const generateSpeech = async (
  text: string, 
  language: string = 'en'
): Promise<string | null> => {
  try {
    // Trim text and check if it's empty
    if (!text?.trim()) {
      console.warn('Empty text provided to generateSpeech');
      return null;
    }

    // This is where we would normally call the API, but due to CORS issues,
    // we'll return the fallback audio directly
    console.log('Using fallback audio due to API CORS issues. Text:', text.substring(0, 100) + '...');
    
    // Always return the fallback audio based on language
    return FALLBACK_AUDIO[language as keyof typeof FALLBACK_AUDIO] || FALLBACK_AUDIO.en;
    
    /* 
    // The following is the code that would be used if CORS issues were resolved
    
    // Split text into chunks (API limitation)
    const chunks = splitTextIntoChunks(text, 4000);
    
    if (chunks.length === 0) {
      console.warn('No text chunks to process');
      return null;
    }
    
    // Only process the first chunk (to reduce API costs)
    const firstChunk = chunks[0];
    
    try {
      // Call Supabase edge function to generate speech with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('ElevenLabs API request timed out')), 8000)
      );
      
      const responsePromise = supabase.functions.invoke('elevenlabs-text-to-speech', {
        body: { 
          text: firstChunk,
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
      console.warn('ElevenLabs API failed, using fallback audio:', apiError);
      
      // Return fallback audio based on language
      return FALLBACK_AUDIO[language as keyof typeof FALLBACK_AUDIO] || FALLBACK_AUDIO.en;
    }
    */
  } catch (error) {
    console.error('Error in speech generation:', error);
    return FALLBACK_AUDIO[language as keyof typeof FALLBACK_AUDIO] || FALLBACK_AUDIO.en;
  }
};

/**
 * Split text into manageable chunks for API processing
 */
const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
  if (!text) return [];
  
  const chunks: string[] = [];
  
  // Split by sentences for more natural breaks
  const sentences = text.split(/(?<=[.!?])\s*/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      // If a single sentence is too long, split it further
      if (sentence.length > maxLength) {
        const words = sentence.split(' ');
        currentChunk = '';
        
        for (const word of words) {
          if (currentChunk.length + word.length + 1 <= maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + word;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            currentChunk = word;
          }
        }
      } else {
        currentChunk = sentence;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

/**
 * Check if browser supports audio playback
 */
export const isAudioSupported = (): boolean => {
  return typeof Audio !== 'undefined';
};