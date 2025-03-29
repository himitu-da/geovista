// src/utils/speechUtils.ts
import { supabase } from '@/integrations/supabase/client';

// Default voice IDs per language
export const VOICE_IDS = {
  en: 'pFZP5JQG7iQjIQuC4Bku', // Lily (English)
  es: 'pqHfZKP75CvOlQylNhV4', // Bill (Spanish)
};

// Generate speech from text
export const generateSpeech = async (
  text: string, 
  language: string = 'en'
): Promise<string | null> => {
  try {
    // Split text into chunks (API limitation)
    const chunks = splitTextIntoChunks(text, 4000);
    
    if (chunks.length === 0) return null;
    
    // Only process the first chunk (to reduce API costs)
    const firstChunk = chunks[0];
    
    console.log('Generating speech for text:', firstChunk.substring(0, 100) + '...');
    
    // Call Supabase edge function to generate speech
    const { data, error } = await supabase.functions.invoke('elevenlabs-text-to-speech', {
      body: { 
        text: firstChunk,
        language: language,
        voice_id: VOICE_IDS[language] || VOICE_IDS.en
      }
    });
    
    if (error) {
      console.error('Supabase edge function error:', error);
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

// Split text into manageable chunks
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

// Play audio from base64 string
export const playSpeech = (audioBase64: string): HTMLAudioElement | null => {
  try {
    if (!audioBase64) {
      console.error('No audio data provided to playSpeech');
      return null;
    }
    
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    
    // Add event listeners for debugging
    audio.addEventListener('play', () => console.log('Audio playback started'));
    audio.addEventListener('error', (e) => console.error('Audio playback error:', e));
    
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
    });
    
    return audio;
  } catch (error) {
    console.error('Error creating audio element:', error);
    return null;
  }
};

// Test if audio playback is supported
export const isAudioSupported = (): boolean => {
  return typeof Audio !== 'undefined';
};