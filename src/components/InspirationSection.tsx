import { Card, CardContent } from "@/components/ui/card";

const InspirationSection = () => {
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

  return (
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
  );
};

export default InspirationSection;