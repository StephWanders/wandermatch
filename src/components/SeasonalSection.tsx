import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, Snowflake, Leaf } from "lucide-react";

const SeasonalSection = () => {
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
  );
};

export default SeasonalSection;