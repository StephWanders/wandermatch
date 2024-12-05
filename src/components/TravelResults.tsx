import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Hotel, Map } from "lucide-react";

const TravelResults = ({ data }: { data: any }) => {
  const hasChildren = data?.travelers?.children?.length > 0;
  const childAges = data?.travelers?.children?.map((child: any) => child.age) || [];
  const hasToddlers = childAges.some((age: number) => age < 5);
  const hasTeens = childAges.some((age: number) => age >= 12);

  const flights = [
    { 
      airline: "SkyWings", 
      price: "$299", 
      departure: "10:00 AM", 
      arrival: "2:30 PM",
      features: hasChildren ? "Family seating, Extra baggage for children" : "Standard seating"
    },
    { 
      airline: "OceanAir", 
      price: "$349", 
      departure: "2:15 PM", 
      arrival: "6:45 PM",
      features: hasChildren ? "Kids meal included, Entertainment package" : "Standard service"
    },
  ];

  const accommodations = [
    { 
      name: hasChildren ? "Family Resort & Spa" : "Seaside Resort",
      price: "$199/night", 
      type: "Hotel", 
      rating: 4.5,
      features: hasChildren ? [
        "Kids club",
        hasToddlers ? "Toddler playground" : "",
        hasTeens ? "Teen activity center" : "",
        "Family rooms available"
      ].filter(Boolean) : []
    },
    { 
      name: hasChildren ? "Family-Friendly Villa" : "Downtown Loft",
      price: "$150/night", 
      type: "Vacation Rental", 
      rating: 4.8,
      features: hasChildren ? [
        "Child-proof rooms",
        "Garden with playground",
        hasToddlers ? "Crib available" : "",
        "Family entertainment"
      ].filter(Boolean) : []
    },
  ];

  const activities = hasChildren ? [
    hasToddlers ? [
      "Day 1: Visit to the Children's Museum & Puppet Show",
      "Day 2: Splash Park & Petting Zoo",
      "Day 3: Interactive Story Time & Park Picnic"
    ] : hasTeens ? [
      "Day 1: Adventure Park & Rock Climbing",
      "Day 2: Water Sports & Beach Activities",
      "Day 3: Teen-friendly City Tour & Shopping"
    ] : [
      "Day 1: Family-friendly City Tour & Interactive Museums",
      "Day 2: Beach Day & Water Activities",
      "Day 3: Theme Park Adventure"
    ]
  ].flat() : [
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
                {flight.features && (
                  <div className="text-sm text-gray-600 mt-1">
                    {flight.features}
                  </div>
                )}
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
                {place.features.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {place.features.map((feature, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        • {feature}
                      </div>
                    ))}
                  </div>
                )}
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