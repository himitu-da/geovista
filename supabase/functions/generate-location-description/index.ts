
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, language } = await req.json();
    
    // Get API key
    const apiKey = Deno.env.get('CLAUDE_API_KEY');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Gemini API endpoint
    const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
    
    // Create appropriate prompt based on language
    const promptEn = `
    For the location at latitude: ${latitude}, longitude: ${longitude}, provide a detailed description.
    Structure your response as follows:

    - Title: A concise name or region for this location
    - Overview: A brief overview of this place (1-2 sentences)
    - Geography: Geographical features of this location (2-3 sentences)
    - History: Historical background of this area (2-3 sentences)
    - Culture: Cultural characteristics of this region (2-3 sentences)
    - Points of Interest: Places to visit (3 bullet points)

    Structure each section clearly and use markdown formatting.
    Keep your response to about 400 characters in English.
    `;

    const promptEs = `
    Para la ubicación en latitud: ${latitude}, longitud: ${longitude}, proporciona una descripción detallada.
    Estructura tu respuesta de la siguiente manera:

    - Título: Un nombre o región conciso para esta ubicación
    - Resumen: Una breve descripción de este lugar (1-2 oraciones)
    - Geografía: Características geográficas de esta ubicación (2-3 oraciones)
    - Historia: Antecedentes históricos de esta área (2-3 oraciones)
    - Cultura: Características culturales de esta región (2-3 oraciones)
    - Puntos de Interés: Lugares para visitar (3 puntos)

    Estructura cada sección claramente y usa formato markdown.
    Mantén tu respuesta en aproximadamente 400 caracteres en español.
    `;

    // Select prompt based on language
    const prompt = language === 'es' ? promptEs : promptEn;

    console.log("Sending request to Gemini API with prompt:", prompt);
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data));
    
    // Extract text from response
    let description = language === 'es' 
      ? "No se pudo generar una descripción." 
      : "Could not generate description.";
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) {
      description = data.candidates[0].content.parts[0].text;
    }
    
    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
