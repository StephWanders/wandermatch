import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts';

const OPENCAGE_API_KEY = Deno.env.get('OPENCAGE_API_KEY');

serve(async (req) => {
  try {
    const { latitude, longitude } = await req.json();
    
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
    );
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});