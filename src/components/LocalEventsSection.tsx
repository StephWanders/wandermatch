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
    const getGPSLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              console.log('Got GPS coordinates:', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              
              // Use default location initially
              const initialCity = defaultLocation.split(',')[0].trim();
              setCurrentLocation(initialCity);
              await fetchEventsForCity(initialCity);
              
              // Attempt reverse geocoding in background
              try {
                const { data: locationData, error: locationError } = await supabase.functions.invoke('reverse-geocode', {
                  body: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  }
                });

                if (locationError) {
                  console.error('Location error:', locationError);
                  return;
                }
                
                if (locationData?.city) {
                  console.log('Location data received:', locationData);
                  setCurrentLocation(locationData.city);
                  await fetchEventsForCity(locationData.city);
                }
              } catch (geoError) {
                console.error("Error in reverse geocoding:", geoError);
              }
            } catch (error) {
              console.error("Error getting city name:", error);
              handleLocationFallback();
            }
          },
          (error) => {
            console.error("Error getting GPS location:", error);
            handleLocationFallback();
          }
        );
      } else {
        console.log('Geolocation not available, using fallback city');
        handleLocationFallback();
      }
    };

    const handleLocationFallback = async () => {
      const fallbackCity = defaultLocation.split(',')[0].trim();
      console.log('Using fallback city:', fallbackCity);
      setCurrentLocation(fallbackCity);
      await fetchEventsForCity(fallbackCity);
    };

    const fetchEventsForCity = async (city: string) => {
      try {
        console.log('Fetching events for city:', city);
        const { data: eventsData, error: eventsError } = await supabase.functions.invoke('get-events', {
          body: { city }
        });

        if (eventsError) throw eventsError;
        
        if (eventsData?.events) {
          setEvents(eventsData.events);
        } else {
          console.log('No events data, using placeholders');
          setEvents(getPlaceholderEvents(city));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents(getPlaceholderEvents(city));
        toast.error("Could not fetch events. Using placeholder events.");
      } finally {
        setLoading(false);
      }
    };

    getGPSLocation();

    // Set a timeout to ensure we don't get stuck in loading state
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, using default location');
        handleLocationFallback();
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
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

  return (
    <section className="mt-16">
      <div className="flex items-center justify-center gap-2 mb-8">
        <MapPin className="h-6 w-6 text-gray-500" />
        <h2 className="text-3xl font-bold text-center">
          What's Happening Tonight in {currentLocation}
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