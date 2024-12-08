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
    const { latitude, longitude } = await req.json();
    
    console.log('Received coordinates:', { latitude, longitude });
    console.log('Using API key:', OPENCAGE_API_KEY ? 'Present' : 'Missing');
    
    if (!OPENCAGE_API_KEY) {
      throw new Error('OpenCage API key is not configured');
    }
    
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenCage API error:', errorText);
      throw new Error(`OpenCage API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('OpenCage API response:', data);
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Error in reverse-geocode function' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});