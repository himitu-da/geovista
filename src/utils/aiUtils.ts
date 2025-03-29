
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate location description based on position (latitude, longitude)
 * Uses Gemini AI to fetch information about the location including history, geography, culture
 */
export const generateLocationDescription = async (position: [number, number], language: string = 'en'): Promise<string> => {
  try {
    // Get latitude and longitude
    const [latitude, longitude] = position;
    
    // Call Supabase edge function to generate description
    const { data, error } = await supabase.functions.invoke('generate-location-description', {
      body: { latitude, longitude, language }
    });
    
    if (error) {
      console.error('Error calling edge function:', error);
      throw new Error(language === 'es' 
        ? 'Error al generar descripción con IA' 
        : 'Failed to generate AI description');
    }
    
    return data.description;
  } catch (error) {
    console.error('Error generating location description:', error);
    throw error;
  }
};
