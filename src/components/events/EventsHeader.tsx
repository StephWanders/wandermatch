import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsHeaderProps {
  location: string;
  onLocationChange: () => void;
}

const EventsHeader = ({ location, onLocationChange }: EventsHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-gray-500" />
        <h2 className="text-3xl font-bold text-center">
          What's Happening Tonight in {location}
        </h2>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onLocationChange}
        className="flex items-center gap-2"
      >
        <MapPin className="h-4 w-4" />
        Change Location
      </Button>
    </div>
  );
};

export default EventsHeader;