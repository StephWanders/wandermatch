import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Shield, MessageCircle, MapPin, Globe } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <Card className="group card-hover border-none bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
        </div>
        <CardTitle className="text-xl text-center group-hover:text-primary transition-colors font-display">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground font-body">{description}</p>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb')] bg-cover bg-center opacity-10" />
      <div className="relative">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text font-display">
          Why Choose WanderMatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={Users}
            title="Smart Matching"
            description="Find companions based on travel style, interests, and destination preferences"
          />
          <FeatureCard
            icon={Calendar}
            title="Travel Groups & Events"
            description="Join group trips or connect with fellow travelers at local events"
          />
          <FeatureCard
            icon={Shield}
            title="Safe & Secure"
            description="Verified profiles and safety features for peace of mind"
          />
          <FeatureCard
            icon={MessageCircle}
            title="Easy Communication"
            description="Chat and video call to plan your perfect trip together"
          />
          <FeatureCard
            icon={MapPin}
            title="Local Insights"
            description="Get insider tips and recommendations from locals and travelers"
          />
          <FeatureCard
            icon={Globe}
            title="Custom Itineraries"
            description="Plan and share travel experiences with your matched companions"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;