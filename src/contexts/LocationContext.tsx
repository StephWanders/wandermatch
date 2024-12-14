import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LocationContextType {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
  isLoading: boolean;
  error: string | null;
  getGPSLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGPSLocation = async () => {
    setIsLoading(true);
    setError(null);

    // Check if we have a cached location in sessionStorage
    const cachedLocation = sessionStorage.getItem("userLocation");
    if (cachedLocation) {
      console.log('Using cached location:', cachedLocation);
      setCurrentLocation(cachedLocation);
      setIsLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        console.log('Got GPS coordinates:', position.coords);
        const { data: locationData, error: locationError } = await supabase.functions.invoke('reverse-geocode', {
          body: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });

        if (locationError) throw locationError;
        
        if (locationData?.results?.[0]?.components?.city) {
          const city = locationData.results[0].components.city;
          console.log('GPS Location city:', city);
          setCurrentLocation(city);
          // Cache the location in sessionStorage
          sessionStorage.setItem("userLocation", city);
        } else {
          throw new Error("Could not determine city from coordinates");
        }
      } catch (error: any) {
        console.error("Error getting location:", error);
        const errorMessage = error.code === 1 
          ? "Location access denied. Please enable location services or enter your location manually."
          : "Could not get your location. Please try again or enter it manually.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } else {
      const message = "Geolocation is not supported by your browser";
      setError(message);
      toast.error(message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getGPSLocation();
  }, []);

  return (
    <LocationContext.Provider 
      value={{ 
        currentLocation, 
        setCurrentLocation, 
        isLoading, 
        error, 
        getGPSLocation 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}