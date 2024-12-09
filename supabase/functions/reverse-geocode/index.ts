import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENCAGE_API_KEY = Deno.env.get('OPENCAGE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENCAGE_API_KEY) {
      console.error('OpenCage API key is not configured');
      return new Response(JSON.stringify({
        error: 'OpenCage API key is not configured',
        details: 'Please configure OPENCAGE_API_KEY in Supabase Edge Function secrets',
        fallback: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { lat, lng } = await req.json();
    
    console.log('Received coordinates:', { lat, lng });
    
    if (!lat || !lng) {
      throw new Error('Missing latitude or longitude');
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenCage API error:', errorText);
      throw new Error(`OpenCage API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('OpenCage API response:', data);

    // Extract city from results
    const result = data.results[0];
    const city = result?.components?.city || 
                 result?.components?.town ||
                 result?.components?.village ||
                 result?.components?.municipality ||
                 'Unknown Location';

    return new Response(JSON.stringify({ 
      city,
      raw: data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Error in reverse-geocode function',
      fallback: true
    }), {
      status: 200, // Keep 200 to allow fallback behavior
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});