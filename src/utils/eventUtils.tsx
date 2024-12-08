import { Music, Theater, Calendar, Users, Camera, Palette } from "lucide-react";
import { ReactNode } from "react";

interface Event {
  title: string;
  type: string;
  time: string;
  location: string;
  price: string;
  description: string;
  tags: string[];
  icon?: ReactNode;
}

export const getEventIcon = (type: string): ReactNode => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('music')) {
    return <Music className="h-6 w-6 text-purple-500" />;
  }
  if (lowerType.includes('theatre') || lowerType.includes('theater')) {
    return <Theater className="h-6 w-6 text-blue-500" />;
  }
  return <Calendar className="h-6 w-6 text-green-500" />;
};

export const getPlaceholderEvents = (cityName: string): Event[] => [
  {
    title: `Live Jazz & Wine Tasting`,
    type: "Music & Culture",
    time: "7:00 PM - 10:00 PM",
    location: `The ${cityName} Jazz Club`,
    price: "$45",
    description: "An evening of smooth jazz paired with curated wine selections from local vineyards",
    tags: ["Live Music", "Wine", "Jazz"],
    icon: <Music className="h-6 w-6 text-purple-500" />
  },
  {
    title: `${cityName} Food & Culture Festival`,
    type: "Community Event",
    time: "4:00 PM - 11:00 PM",
    location: `${cityName} Central Park`,
    price: "Free Entry",
    description: "Celebrate diversity with international cuisine, cultural performances, and local artisans",
    tags: ["Food", "Culture", "Family-Friendly"],
    icon: <Users className="h-6 w-6 text-blue-500" />
  },
  {
    title: "Photography Workshop & Gallery",
    type: "Art & Learning",
    time: "6:30 PM - 9:00 PM",
    location: `${cityName} Creative Space`,
    price: "$35",
    description: "Learn night photography techniques followed by a gallery showcase of local talent",
    tags: ["Workshop", "Photography", "Art"],
    icon: <Camera className="h-6 w-6 text-green-500" />
  },
  {
    title: "Interactive Art Exhibition",
    type: "Art & Entertainment",
    time: "5:00 PM - 10:00 PM",
    location: `${cityName} Modern Art Museum`,
    price: "$20",
    description: "Experience cutting-edge digital art installations with interactive elements",
    tags: ["Art", "Interactive", "Modern"],
    icon: <Palette className="h-6 w-6 text-red-500" />
  }
];