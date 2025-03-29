// src/utils/speechUtils.ts
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Default voice IDs per language
export const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (English)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (Spanish)
};

/**
 * Generate speech from text with improved error handling
 * @param text The text to convert to speech
 * @param language The language code ('en' or 'es')
 * @returns Promise that resolves to a base64 audio string or null on failure
 */
export const generateSpeech = async (
  text: string, 
  language: string = 'en'
): Promise<string | null> => {
  try {
    // Validate inputs
    if (!text || text.trim() === '') {
      console.error('Empty text provided to speech generator');
      return null;
    }

    // Split text into chunks (API limitation)
    const chunks = splitTextIntoChunks(text, 3000); // Reduced to 3000 to be safer
    
    if (chunks.length === 0) return null;
    
    // Only process the first chunk to reduce API costs and avoid timeouts
    const firstChunk = chunks[0];
    
    console.log('Generating speech for text:', firstChunk.substring(0, 100) + '...');
    
    // Call Supabase edge function to generate speech with improved timeout handling
    const { data, error } = await Promise.race([
      supabase.functions.invoke('elevenlabs-text-to-speech', {
        body: { 
          text: firstChunk,
          language: language,
          voice_id: VOICE_IDS[language as keyof typeof VOICE_IDS] || VOICE_IDS.en
        }
      }),
      // Add a timeout to prevent hanging requests
      new Promise<{data: null, error: Error}>((resolve) => {
        setTimeout(() => {
          resolve({
            data: null, 
            error: new Error('Speech generation timed out after 10 seconds')
          });
        }, 10000); // 10 second timeout
      })
    ]);
    
    if (error) {
      console.error('Supabase edge function error:', error);
      // Enhanced error logging for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return null;
    }
    
    if (!data || !data.audio) {
      console.error('No audio data returned from API');
      return null;
    }
    
    // For debugging
    console.log('Audio data received, length:', data.audio.length);
    
    return data.audio; // Base64 encoded audio data
  } catch (error) {
    console.error('Error in speech generation:', error);
    return null;
  }
};

/**
 * Split text into manageable chunks
 * @param text The text to split
 * @param maxLength Maximum length of each chunk
 * @returns Array of text chunks
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
 * Check if the text is too long for speech synthesis
 * @param text The text to check
 * @param limit Maximum character limit (default: 5000)
 * @returns Boolean indicating if text exceeds limit
 */
export const isTextTooLongForSpeech = (text: string, limit: number = 5000): boolean => {
  return text.length > limit;
};

// Test if audio playback is supported
export const isAudioSupported = (): boolean => {
  return typeof Audio !== 'undefined';
};