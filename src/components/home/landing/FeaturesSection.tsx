import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Users, Shield } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Smart Matching Algorithm",
    description: "Our advanced AI-powered matching system analyzes travel preferences, personality traits, and past experiences to connect you with ideal travel companions. Find people who share your adventure style, whether you're a luxury traveler or a backpacker."
  },
  {
    icon: Users,
    title: "Travel Groups & Events",
    description: "Join curated group trips or create your own adventure. Connect with fellow travelers through local meetups, cultural exchanges, and destination-specific gatherings. Perfect for solo travelers looking to join existing groups or form new ones."
  },
  {
    icon: Shield,
    title: "Safety Tools",
    description: "Your safety is our top priority. Every profile undergoes thorough verification, including ID checks and travel history validation. Our built-in safety features include emergency contacts, location sharing, and 24/7 support to ensure secure and comfortable connections."
  }
];

const FeaturesSection = () => {
  return (
    <section id="why-choose-wandermatch" className="py-24 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">
          Why Choose WanderMatch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group overflow-hidden bg-white/95 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-bl-[100px] -z-10 transition-all duration-300 group-hover:scale-110" />
                
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary-200 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-4 h-1 w-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:w-24 transition-all duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;