import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Theater, Pizza, Ticket } from "lucide-react";

const LocalEventsSection = ({ location }: { location: string }) => {
  // Event templates that will be customized based on location
  const getLocationEvents = (cityName: string) => [
    {
      title: `Jazz Night at ${cityName} Lounge`,
      type: "Music",
      icon: <Music className="h-6 w-6 text-purple-500" />,
      time: "8:00 PM",
      location: `Downtown ${cityName}`,
      price: "$25",
      description: "Live jazz performance featuring local artists"
    },
    {
      title: `${cityName} Food Festival`,
      type: "Food",
      icon: <Pizza className="h-6 w-6 text-red-500" />,
      time: "6:00 PM - 11:00 PM",
      location: `${cityName} City Center`,
      price: "Free Entry",
      description: "Local vendors serving international cuisine"
    },
    {
      title: "Community Theater Night",
      type: "Theater",
      icon: <Theater className="h-6 w-6 text-blue-500" />,
      time: "7:30 PM",
      location: `${cityName} Theater`,
      price: "$40",
      description: `Experience ${cityName}'s finest local talent`
    },
    {
      title: `${cityName} Night Market`,
      type: "Shopping & Entertainment",
      icon: <Ticket className="h-6 w-6 text-green-500" />,
      time: "5:00 PM - 10:00 PM",
      location: `${cityName} Downtown`,
      price: "Free Entry",
      description: "Artisan crafts, live music, and local goods"
    }
  ];

  // Extract city name from full location (e.g., "San Francisco, CA" -> "San Francisco")
  const cityName = location.split(',')[0].trim();
  const tonightEvents = getLocationEvents(cityName);

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        What's Happening Tonight in {cityName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tonightEvents.map((event, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {event.icon}
                <span className="text-sm font-medium text-gray-600">{event.type}</span>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{event.time}</span>
                  <span className="text-primary">{event.price}</span>
                </div>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LocalEventsSection;