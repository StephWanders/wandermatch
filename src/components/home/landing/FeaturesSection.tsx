import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Shield } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching Algorithm",
    description: "Find travel companions who share your interests, destinations, and travel style."
  },
  {
    icon: Calendar,
    title: "Travel Groups & Events",
    description: "Join group trips or connect with fellow travelers at local events."
  },
  {
    icon: Shield,
    title: "Safety Tools",
    description: "Verified profiles and safety features for peace of mind while traveling."
  }
];

const FeaturesSection = () => {
  return (
    <section id="why-choose-wandermatch" className="py-24 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Why Choose WanderMatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="overflow-hidden bg-white/95 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-600/20">
                  <feature.icon className="w-12 h-12 absolute bottom-4 right-4 text-teal-600" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;