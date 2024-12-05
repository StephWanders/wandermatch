import { useState } from "react";
import TravelForm from "@/components/TravelForm";
import TravelResults from "@/components/TravelResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, Snowflake, Leaf } from "lucide-react";

const Index = () => {
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = (data: any) => {
    setSearchResults(data);
  };

  const inspirationalDestinations = [
    {
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
      description: "Perfect for spiritual retreats and beach lovers",
      bestFor: ["Singles", "Couples", "Digital Nomads"]
    },
    {
      name: "Swiss Alps",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      description: "Ideal for adventure and nature enthusiasts",
      bestFor: ["Families", "Adventure Seekers"]
    }
  ];

  const seasonalRecommendations = [
    {
      season: "Summer (June-August)",
      icon: <Sun className="h-6 w-6 text-yellow-500" />,
      destinations: [
        {
          type: "Families",
          suggestions: "Beach resorts in Mediterranean, Theme parks in Orlando"
        },
        {
          type: "Singles",
          suggestions: "Greek Islands, Barcelona, Croatian coast"
        }
      ]
    },
    {
      season: "Fall (September-November)",
      icon: <Leaf className="h-6 w-6 text-orange-500" />,
      destinations: [
        {
          type: "Families",
          suggestions: "Disney World (lower crowds), New England fall colors"
        },
        {
          type: "Singles",
          suggestions: "Wine regions in France, City breaks in Europe"
        }
      ]
    },
    {
      season: "Winter (December-February)",
      icon: <Snowflake className="h-6 w-6 text-blue-500" />,
      destinations: [
        {
          type: "Families",
          suggestions: "Ski resorts, Lapland for Santa visits"
        },
        {
          type: "Singles",
          suggestions: "Christmas markets in Europe, Skiing in the Alps"
        }
      ]
    },
    {
      season: "Spring (March-May)",
      icon: <Cloud className="h-6 w-6 text-sky-500" />,
      destinations: [
        {
          type: "Families",
          suggestions: "Cherry blossoms in Japan, Netherlands tulip fields"
        },
        {
          type: "Singles",
          suggestions: "City breaks, Cherry blossom festivals"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div 
        className="h-[50vh] bg-cover bg-center relative"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80)',
          backgroundPosition: 'center 60%'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-4">
            Discover amazing destinations and create unforgettable memories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <TravelForm onSearch={handleSearch} />
        
        {searchResults && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Travel Options for {searchResults.location}
            </h2>
            <TravelResults data={searchResults} />
          </div>
        )}

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Don't Know Where to Travel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inspirationalDestinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-2">{destination.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.bestFor.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Best Seasons to Travel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalRecommendations.map((season, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {season.icon}
                    {season.season}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {season.destinations.map((dest, idx) => (
                    <div key={idx} className="mb-4">
                      <h4 className="font-semibold text-lg mb-1">{dest.type}</h4>
                      <p className="text-gray-600">{dest.suggestions}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;