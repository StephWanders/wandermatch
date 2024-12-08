import { Users, Camera, Palette, Music, Theater, Calendar } from "lucide-react";

export const getEventIcon = (type: string) => {
  type = type.toLowerCase();
  if (type.includes('music')) return <Music className="h-6 w-6 text-purple-500" />;
  if (type.includes('theatre') || type.includes('theater')) return <Theater className="h-6 w-6 text-blue-500" />;
  return <Calendar className="h-6 w-6 text-green-500" />;
};

export const getPlaceholderEvents = (cityName: string) => [
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