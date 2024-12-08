import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventCard from "./events/EventCard";
import { getPlaceholderEvents } from "@/utils/eventUtils";

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
          <EventCard key={index} event={event} />
        ))}
      </div>
    </section>
  );
};

export default LocalEventsSection;