import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Map, Shield, MessageCircle, Compass, Lock } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  subPoints = [],
  buttonText,
  buttonVariant = "default"
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  subPoints?: string[];
  buttonText: string;
  buttonVariant?: "default" | "secondary";
}) => {
  return (
    <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
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
        <p className="text-gray-600 mb-3">{description}</p>
        {subPoints.length > 0 && (
          <ul className="space-y-2 mb-4 text-sm text-gray-600">
            {subPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1 text-teal-500">•</span>
                {point}
              </li>
            ))}
          </ul>
        )}
        <Button 
          className={`w-full ${
            buttonVariant === "default"
              ? "bg-teal-500 hover:bg-teal-600 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
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
            title="Smart Matching Algorithm"
            description="Our advanced algorithm connects you with like-minded travelers based on your unique preferences and travel style."
            subPoints={[
              "Personalized matches based on travel style and budget",
              "Destination and date compatibility",
              "Interest-based connections for shared experiences"
            ]}
            buttonText="Find Your Match"
          />
          <FeatureCard
            icon={Map}
            title="Travel Groups & Events"
            description="Join curated group trips and exciting local events tailored to your interests and travel goals."
            subPoints={[
              "Digital nomad meetups worldwide",
              "Adventure group expeditions",
              "Local cultural experiences"
            ]}
            buttonText="Explore Events"
            buttonVariant="secondary"
          />
          <FeatureCard
            icon={Shield}
            title="Safety Tools"
            description="Travel with confidence using our comprehensive safety features designed to protect and empower travelers."
            subPoints={[
              "Real-time location sharing",
              "24/7 SOS emergency support",
              "Verified profiles and reviews"
            ]}
            buttonText="Learn More"
            buttonVariant="secondary"
          />
          <FeatureCard
            icon={MessageCircle}
            title="Easy Communication"
            description="Connect seamlessly with potential travel companions through our intuitive chat platform."
            subPoints={[
              "Real-time messaging",
              "Voice and video calls",
              "Trip planning tools"
            ]}
            buttonText="Start Chatting"
          />
          <FeatureCard
            icon={Compass}
            title="Travel Troops"
            description="Join travel communities based on your interests and preferred destinations."
            subPoints={[
              "Interest-based groups",
              "Local travel tips",
              "Shared itineraries"
            ]}
            buttonText="Join Groups"
            buttonVariant="secondary"
          />
          <FeatureCard
            icon={Lock}
            title="Privacy First"
            description="Your privacy and security are our top priorities with advanced protection measures."
            subPoints={[
              "Customizable privacy settings",
              "Secure data encryption",
              "Profile verification"
            ]}
            buttonText="Learn More"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;