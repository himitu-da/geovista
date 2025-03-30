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

// Maximum length of text to process at once
const MAX_TEXT_LENGTH = 500;

// Maximum retries for API requests
const MAX_RETRIES = 2;

// Error types for better error handling
export enum SpeechErrorType {
  TIMEOUT = 'timeout',
  API_ERROR = 'api_error',
  INVALID_INPUT = 'invalid_input',
  UNKNOWN = 'unknown'
}

export interface SpeechError extends Error {
  type: SpeechErrorType;
}

/**
 * Generate speech from text using ElevenLabs API via Supabase Edge Function
 * with improved error handling and retry mechanism
 * 
 * @param text The text to convert to speech
 * @param language The language code (en, es)
 * @returns Promise with base64 audio data
 */
export const generateSpeech = async (
  text: string, 
  language: string = 'en',
  retryCount: number = 0
): Promise<string | null> => {
  try {
    // Validate input
    if (!text?.trim()) {
      console.warn('Empty text provided to generateSpeech');
      const error = new Error('Empty text provided') as SpeechError;
      error.type = SpeechErrorType.INVALID_INPUT;
      throw error;
    }

    // Only support English and Spanish
    if (language !== 'en' && language !== 'es') {
      language = 'en'; // Default to English for unsupported languages
    }

    console.log(`Generating speech for ${language} text: ${text.substring(0, 50)}...`);
    
    // Process text chunks to prevent timeouts with long text
    // For simplicity, we'll just take the first part of the text
    const processedText = text.substring(0, MAX_TEXT_LENGTH);
    
    // Increased timeout to 30 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutError = new Error('API request timed out') as SpeechError;
      timeoutError.type = SpeechErrorType.TIMEOUT;
      setTimeout(() => reject(timeoutError), 30000);
    });
    
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
      const apiError = new Error(result.error.message || 'Error calling speech service') as SpeechError;
      apiError.type = SpeechErrorType.API_ERROR;
      throw apiError;
    }
    
    // Parse response
    const data = result.data as TextToSpeechResponse;
    
    if (!data || !data.audio) {
      console.error('No audio data returned from API');
      const apiError = new Error('No audio data received') as SpeechError;
      apiError.type = SpeechErrorType.API_ERROR;
      throw apiError;
    }
    
    // Return the base64 audio data
    return data.audio;
    
  } catch (error) {
    // Handle timeouts with retry logic
    if (error instanceof Error) {
      const speechError = error as SpeechError;
      
      // Retry if it's a timeout and we haven't exceeded max retries
      if (speechError.type === SpeechErrorType.TIMEOUT && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} timed out, retrying...`);
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        
        // Retry with an incremented retry count
        return generateSpeech(text, language, retryCount + 1);
      }
      
      // Log the appropriate error message
      if (speechError.type === SpeechErrorType.TIMEOUT) {
        console.error('Speech generation timed out after multiple attempts');
      } else {
        console.error('Error in speech generation:', error);
      }
    } else {
      console.error('Unknown error in speech generation');
    }
    
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

/**
 * Fall back audio generation using browser's built-in speech synthesis
 * when Elevenlabs is unavailable
 */
export const generateFallbackSpeech = (
  text: string, 
  language: string = 'en'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Browser does not support speech synthesis'));
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};