import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationData {
  city?: string;
}

const getPlaceholderEvents = (cityName: string) => [
  {
    title: `Live Jazz & Wine Tasting`,
    type: "Music & Culture",
    time: "7:00 PM - 10:00 PM",
    location: `The ${cityName} Jazz Club`,
    price: "$45",
    description: "An evening of smooth jazz paired with curated wine selections from local vineyards",
    tags: ["Live Music", "Wine", "Jazz"]
  },
  {
    title: `${cityName} Food & Culture Festival`,
    type: "Community Event",
    time: "4:00 PM - 11:00 PM",
    location: `${cityName} Central Park`,
    price: "Free Entry",
    description: "Celebrate diversity with international cuisine, cultural performances, and local artisans",
    tags: ["Food", "Culture", "Family-Friendly"]
  },
  {
    title: "Photography Workshop & Gallery",
    type: "Art & Learning",
    time: "6:30 PM - 9:00 PM",
    location: `${cityName} Creative Space`,
    price: "$35",
    description: "Learn night photography techniques followed by a gallery showcase of local talent",
    tags: ["Workshop", "Photography", "Art"]
  },
  {
    title: "Interactive Art Exhibition",
    type: "Art & Entertainment",
    time: "5:00 PM - 10:00 PM",
    location: `${cityName} Modern Art Museum`,
    price: "$20",
    description: "Experience cutting-edge digital art installations with interactive elements",
    tags: ["Art", "Interactive", "Modern"]
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city } = await req.json() as LocationData;
    console.log('Received request with city:', city);

    const events = getPlaceholderEvents(city || 'Your City');
    console.log('Returning placeholder events for:', city);

    return new Response(
      JSON.stringify({ events }),
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