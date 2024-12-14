import { useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EventCard from "./events/EventCard";
import { getPlaceholderEvents } from "@/utils/eventUtils";
import { useLocation } from "@/contexts/LocationContext";

const LocalEventsSection = ({ location: defaultLocation }: { location: string }) => {
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

  // Fetch events when location changes
  useState(() => {
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
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-gray-500" />
          <h2 className="text-3xl font-bold text-center">
            What's Happening Tonight in {currentLocation || defaultLocation}
          </h2>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowLocationDialog(true)}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Change Location
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>

      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Your Location</DialogTitle>
            <DialogDescription>
              Enter your city name to see local events
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 mb-4">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleManualLocationSubmit} className="space-y-4">
            <Input
              placeholder="Enter city name"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit">Set Location</Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowLocationDialog(false);
                  getGPSLocation();
                }}
              >
                Try GPS Again
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LocalEventsSection;