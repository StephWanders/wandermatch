import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getPlaceholderEvents } from "@/utils/eventUtils";
import { useLocation } from "@/contexts/LocationContext";
import EventsHeader from "./events/EventsHeader";
import EventsGrid from "./events/EventsGrid";
import LocationDialog from "./events/LocationDialog";

interface LocalEventsSectionProps {
  location: string;
}

const LocalEventsSection = ({ location: defaultLocation }: LocalEventsSectionProps) => {
  const { currentLocation, setCurrentLocation, isLoading, error, getGPSLocation } = useLocation();
  const [events, setEvents] = useState<any[]>([]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [fetchingEvents, setFetchingEvents] = useState(false);

  const fetchEventsForCity = async (city: string) => {
    setFetchingEvents(true);
    try {
      console.log('Fetching events for city:', city);
      const { data: eventsData, error: eventsError } = await supabase.functions.invoke('get-events', {
        body: { city }
      });

      if (eventsError) throw eventsError;
      setEvents(eventsData.events || getPlaceholderEvents(city));
    } catch (error) {
      console.error("Error:", error);
      setEvents(getPlaceholderEvents(city));
      toast.error("Could not fetch events. Using placeholder events.");
    } finally {
      setFetchingEvents(false);
    }
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLocation.trim()) {
      setCurrentLocation(manualLocation.trim());
      sessionStorage.setItem("userLocation", manualLocation.trim());
      fetchEventsForCity(manualLocation.trim());
      setShowLocationDialog(false);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      fetchEventsForCity(currentLocation);
    } else if (defaultLocation) {
      setCurrentLocation(defaultLocation);
      fetchEventsForCity(defaultLocation);
    }
  }, [currentLocation, defaultLocation]);

  if (isLoading || fetchingEvents) {
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
      <EventsHeader 
        location={currentLocation || defaultLocation}
        onLocationChange={() => setShowLocationDialog(true)}
      />

      <EventsGrid events={events} />

      <LocationDialog 
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        manualLocation={manualLocation}
        setManualLocation={setManualLocation}
        onSubmit={handleManualLocationSubmit}
        error={error}
        onGPSRetry={getGPSLocation}
      />
    </section>
  );
};

export default LocalEventsSection;