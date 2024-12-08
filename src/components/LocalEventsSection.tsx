import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Theater, Ticket, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const LocalEventsSection = ({ location: defaultLocation }: { location: string }) => {
  const [currentLocation, setCurrentLocation] = useState<string>(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('Attempting to reverse geocode coordinates:', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });

            const { data: locationData, error: locationError } = await supabase.functions.invoke('reverse-geocode', {
              body: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });

            if (locationError) {
              console.error('Supabase function error:', locationError);
              throw locationError;
            }

            console.log('Reverse geocode response:', locationData);
            
            let city;
            if (locationData?.fallback) {
              console.log('Using fallback location due to API configuration issue');
              city = defaultLocation.split(',')[0].trim();
              setCurrentLocation(defaultLocation);
              toast.error("Location service unavailable. Using default location.");
            } else if (locationData?.results?.[0]?.components) {
              city = locationData.results[0].components.city || 
                     locationData.results[0].components.town ||
                     locationData.results[0].components.village ||
                     defaultLocation.split(',')[0].trim();
              setCurrentLocation(city);
            } else {
              console.warn('No location data in response:', locationData);
              city = defaultLocation.split(',')[0].trim();
              setCurrentLocation(defaultLocation);
              toast.error("Could not determine location. Using default location.");
            }

            // Fetch events for the determined city
            const { data: eventsData, error: eventsError } = await supabase.functions.invoke('get-events', {
              body: {
                city,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });

            if (eventsError) {
              throw eventsError;
            }

            if (eventsData.fallback) {
              toast.error("Events service unavailable. Using placeholder events.");
              setEvents(getPlaceholderEvents(city));
            } else {
              setEvents(eventsData.events);
            }

          } catch (error) {
            console.error("Error:", error);
            setCurrentLocation(defaultLocation);
            setEvents(getPlaceholderEvents(defaultLocation.split(',')[0].trim()));
            toast.error("Could not fetch live events. Using placeholder events.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          const city = defaultLocation.split(',')[0].trim();
          setCurrentLocation(defaultLocation);
          setEvents(getPlaceholderEvents(city));
          toast.error("Could not access location. Using default location.");
          setLoading(false);
        }
      );
    } else {
      const city = defaultLocation.split(',')[0].trim();
      setCurrentLocation(defaultLocation);
      setEvents(getPlaceholderEvents(city));
      toast.error("Geolocation is not supported by your browser. Using default location.");
      setLoading(false);
    }
  }, [defaultLocation]);

  const getPlaceholderEvents = (cityName: string) => [
    {
      title: `Live Jazz & Wine Tasting`,
      type: "Music & Culture",
      icon: <Music className="h-6 w-6 text-purple-500" />,
      time: "7:00 PM - 10:00 PM",
      location: `The ${cityName} Jazz Club`,
      price: "$45",
      description: "An evening of smooth jazz paired with curated wine selections from local vineyards",
      tags: ["Live Music", "Wine", "Jazz"]
    },
    {
      title: `${cityName} Food & Culture Festival`,
      type: "Community Event",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      time: "4:00 PM - 11:00 PM",
      location: `${cityName} Central Park`,
      price: "Free Entry",
      description: "Celebrate diversity with international cuisine, cultural performances, and local artisans",
      tags: ["Food", "Culture", "Family-Friendly"]
    },
    {
      title: "Photography Workshop & Gallery",
      type: "Art & Learning",
      icon: <Camera className="h-6 w-6 text-green-500" />,
      time: "6:30 PM - 9:00 PM",
      location: `${cityName} Creative Space`,
      price: "$35",
      description: "Learn night photography techniques followed by a gallery showcase of local talent",
      tags: ["Workshop", "Photography", "Art"]
    },
    {
      title: "Interactive Art Exhibition",
      type: "Art & Entertainment",
      icon: <Palette className="h-6 w-6 text-red-500" />,
      time: "5:00 PM - 10:00 PM",
      location: `${cityName} Modern Art Museum`,
      price: "$20",
      description: "Experience cutting-edge digital art installations with interactive elements",
      tags: ["Art", "Interactive", "Modern"]
    }
  ];

  const getEventIcon = (type: string) => {
    type = type.toLowerCase();
    if (type.includes('music')) return <Music className="h-6 w-6 text-purple-500" />;
    if (type.includes('theatre') || type.includes('theater')) return <Theater className="h-6 w-6 text-blue-500" />;
    return <Calendar className="h-6 w-6 text-green-500" />;
  };

  if (loading) {
    return (
      <section className="mt-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  const cityName = currentLocation.split(',')[0].trim();

  return (
    <section className="mt-16">
      <div className="flex items-center justify-center gap-2 mb-8">
        <MapPin className="h-6 w-6 text-gray-500" />
        <h2 className="text-3xl font-bold text-center">
          What's Happening Tonight in {cityName}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {getEventIcon(event.type)}
                <span className="text-sm font-medium text-gray-600">{event.type}</span>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{event.time}</span>
                  <span className="text-primary">{event.price}</span>
                </div>
                <p className="text-sm text-gray-500">{event.location}</p>
                {event.url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => window.open(event.url, '_blank')}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Get Tickets
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LocalEventsSection;
