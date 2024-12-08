import LocalEventsSection from "@/components/LocalEventsSection";

interface LocationContentProps {
  location: string;
}

const LocationContent = ({ location }: LocationContentProps) => {
  // Format location to handle both city-only and city,country formats
  const formattedLocation = location ? location.split(',')[0].trim() : 'Unknown Location';

  if (formattedLocation === 'Unknown Location') {
    return null;
  }

  return <LocalEventsSection location={formattedLocation} />;
};

export default LocationContent;