import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Shield } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching Algorithm",
    description: "Our advanced AI-powered matching system analyzes travel preferences, personality traits, and past experiences to connect you with ideal travel companions. Find people who share your adventure style, whether you're a luxury traveler or a backpacker.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    icon: Calendar,
    title: "Travel Groups & Events",
    description: "Join curated group trips or create your own adventure. Connect with fellow travelers through local meetups, cultural exchanges, and destination-specific gatherings. Perfect for solo travelers looking to join existing groups or form new ones.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    icon: Shield,
    title: "Safety Tools",
    description: "Your safety is our top priority. Every profile undergoes thorough verification, including ID checks and travel history validation. Our built-in safety features include emergency contacts, location sharing, and 24/7 support to ensure secure and comfortable connections.",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"
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
              <div 
                className="aspect-[4/3] relative overflow-hidden"
                style={{
                  backgroundImage: `url(${feature.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-600/20">
                  <feature.icon className="w-12 h-12 absolute bottom-4 right-4 text-teal-600" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;