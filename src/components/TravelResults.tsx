import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Hotel, Map } from "lucide-react";

const TravelResults = ({ data }: { data: any }) => {
  const flights = [
    { airline: "SkyWings", price: "$299", departure: "10:00 AM", arrival: "2:30 PM" },
    { airline: "OceanAir", price: "$349", departure: "2:15 PM", arrival: "6:45 PM" },
  ];

  const accommodations = [
    { name: "Seaside Resort", price: "$199/night", type: "Hotel", rating: 4.5 },
    { name: "Downtown Loft", price: "$150/night", type: "Airbnb", rating: 4.8 },
  ];

  const activities = [
    "Day 1: City Tour & Local Markets",
    "Day 2: Beach Day & Water Sports",
    "Day 3: Historical Sites & Museums",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            Flight Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flights.map((flight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-semibold">{flight.airline}</div>
                <div className="text-sm text-gray-600">
                  {flight.departure} - {flight.arrival}
                </div>
                <div className="text-primary font-bold mt-2">{flight.price}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-primary" />
            Accommodations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accommodations.map((place, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-semibold">{place.name}</div>
                <div className="text-sm text-gray-600">{place.type}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-bold">{place.price}</span>
                  <span className="text-sm">★ {place.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Suggested Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="text-sm">{activity}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelResults;