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
    const fetchEvents = async () => {
      try {
        const city = defaultLocation.split(',')[0].trim();
        setCurrentLocation(city);

        const { data: eventsData, error: eventsError } = await supabase.functions.invoke('get-events', {
          body: { city }
        });

        if (eventsError) {
          throw eventsError;
        }

        setEvents(eventsData.events || getPlaceholderEvents(city));
      } catch (error) {
        console.error("Error:", error);
        const city = defaultLocation.split(',')[0].trim();
        setCurrentLocation(city);
        setEvents(getPlaceholderEvents(city));
        toast.error("Could not fetch events. Using placeholder events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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