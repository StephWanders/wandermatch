import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TICKETMASTER_API_KEY = Deno.env.get('TICKETMASTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, city } = await req.json() as LocationData;

    if (!TICKETMASTER_API_KEY) {
      console.log('Ticketmaster API key not configured');
      return new Response(
        JSON.stringify({
          fallback: true,
          error: "Ticketmaster API key not configured"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Use city name if provided, otherwise use lat/long
    const locationQuery = city 
      ? `&city=${encodeURIComponent(city)}`
      : `&latlong=${latitude},${longitude}`;

    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}${locationQuery}&size=4&sort=date,asc&startDateTime=${new Date().toISOString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }

    const events = data._embedded?.events || [];
    const formattedEvents = events.map((event: any) => ({
      title: event.name,
      type: event.classifications?.[0]?.segment?.name || "Event",
      time: `${new Date(event.dates.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      location: event._embedded?.venues?.[0]?.name || "Venue TBA",
      price: event.priceRanges 
        ? `$${Math.floor(event.priceRanges[0].min)} - $${Math.ceil(event.priceRanges[0].max)}`
        : "Price TBA",
      description: event.info || event.name,
      tags: [
        event.classifications?.[0]?.segment?.name,
        event.classifications?.[0]?.genre?.name,
        event.classifications?.[0]?.subGenre?.name
      ].filter(Boolean),
      url: event.url
    }));

    return new Response(
      JSON.stringify({ events: formattedEvents }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-events function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});