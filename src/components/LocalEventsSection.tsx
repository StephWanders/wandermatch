import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Theater, Pizza, Ticket, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LocalEventsSection = ({ location: defaultLocation }: { location: string }) => {
  const [currentLocation, setCurrentLocation] = useState<string>(defaultLocation);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('Attempting to reverse geocode coordinates:', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });

            const { data, error } = await supabase.functions.invoke('reverse-geocode', {
              body: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });

            if (error) {
              console.error('Supabase function error:', error);
              throw error;
            }

            console.log('Reverse geocode response:', data);
            
            // Check if we got a fallback response
            if (data?.fallback) {
              console.log('Using fallback location due to API configuration issue');
              setCurrentLocation(defaultLocation);
              toast.error("Location service unavailable. Using default location.");
            } else if (data?.results?.[0]?.components) {
              const city = data.results[0].components.city || 
                          data.results[0].components.town ||
                          data.results[0].components.village ||
                          defaultLocation.split(',')[0].trim();
              setCurrentLocation(city);
            } else {
              console.warn('No location data in response:', data);
              setCurrentLocation(defaultLocation);
              toast.error("Could not determine location. Using default location.");
            }
          } catch (error) {
            console.error("Error getting location:", error);
            setCurrentLocation(defaultLocation);
            toast.error("Could not get current location. Using default location.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation(defaultLocation);
          toast.error("Could not access location. Using default location.");
          setLoading(false);
        }
      );
    } else {
      setCurrentLocation(defaultLocation);
      toast.error("Geolocation is not supported by your browser. Using default location.");
      setLoading(false);
    }
  }, [defaultLocation]);

  // Event templates that will be customized based on location
  const getLocationEvents = (cityName: string) => [
    {
      title: `Jazz Night at ${cityName} Lounge`,
      type: "Music",
      icon: <Music className="h-6 w-6 text-purple-500" />,
      time: "8:00 PM",
      location: `Downtown ${cityName}`,
      price: "$25",
      description: "Live jazz performance featuring local artists"
    },
    {
      title: `${cityName} Food Festival`,
      type: "Food",
      icon: <Pizza className="h-6 w-6 text-red-500" />,
      time: "6:00 PM - 11:00 PM",
      location: `${cityName} City Center`,
      price: "Free Entry",
      description: "Local vendors serving international cuisine"
    },
    {
      title: "Community Theater Night",
      type: "Theater",
      icon: <Theater className="h-6 w-6 text-blue-500" />,
      time: "7:30 PM",
      location: `${cityName} Theater`,
      price: "$40",
      description: `Experience ${cityName}'s finest local talent`
    },
    {
      title: `${cityName} Night Market`,
      type: "Shopping & Entertainment",
      icon: <Ticket className="h-6 w-6 text-green-500" />,
      time: "5:00 PM - 10:00 PM",
      location: `${cityName} Downtown`,
      price: "Free Entry",
      description: "Artisan crafts, live music, and local goods"
    }
  ];

  const cityName = currentLocation.split(',')[0].trim();
  const tonightEvents = getLocationEvents(cityName);

  if (loading) {
    return (
      <section className="mt-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-center gap-2 mb-8">
        <MapPin className="h-6 w-6 text-gray-500" />
        <h2 className="text-3xl font-bold text-center">
          What's Happening Tonight in {cityName}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tonightEvents.map((event, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {event.icon}
                <span className="text-sm font-medium text-gray-600">{event.type}</span>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{event.time}</span>
                  <span className="text-primary">{event.price}</span>
                </div>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LocalEventsSection;