import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Map, Shield, MessageCircle, Compass, Lock } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  buttonText,
  buttonVariant = "default"
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "secondary";
}) => {
  return (
    <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-none shadow-lg">
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className={`absolute inset-0 ${
          buttonVariant === "default" 
            ? "bg-gradient-to-br from-teal-500/20 to-teal-600/20" 
            : "bg-gradient-to-br from-orange-500/20 to-orange-600/20"
        }`}>
          <Icon className={`w-12 h-12 absolute bottom-4 right-4 ${
            buttonVariant === "default" ? "text-teal-600" : "text-orange-600"
          }`} />
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button 
          className={`w-full ${
            buttonVariant === "default"
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Why Choose WanderMatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Users}
            title="Smart Matching"
            description="Find companions based on travel style, interests, and destination preferences"
            buttonText="Join Now"
          />
          <FeatureCard
            icon={Map}
            title="Travel Groups"
            description="Join group trips or connect with fellow travelers at local events"
            buttonText="Learn More"
            buttonVariant="secondary"
          />
          <FeatureCard
            icon={Shield}
            title="Safety Tools"
            description="Verified profiles and safety features for peace of mind"
            buttonText="Learn More"
            buttonVariant="secondary"
          />
          <FeatureCard
            icon={MessageCircle}
            title="Easy Communication"
            description="Chat and video call to plan your perfect trip together"
            buttonText="Join Now"
          />
          <FeatureCard
            icon={Compass}
            title="Travel Troops"
            description="Find your tribe and explore together with like-minded adventurers"
            buttonText="Learn More"
            buttonVariant="secondary"
          />
          <FeatureCard
            icon={Lock}
            title="Privacy First"
            description="Control your visibility and share only what you want"
            buttonText="Join Now"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;