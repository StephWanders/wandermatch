import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Shield, MessageSquare, Calendar, MapPin, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find Your Perfect Travel Companion
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with like-minded travelers who share your passion for exploration and adventure.
        </p>
        <Button size="lg" className="mb-8">
          Start Matching
        </Button>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose WanderMatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
            icon={MessageSquare}
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
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
            <CardDescription>
              Join thousands of travelers finding their perfect travel companions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button size="lg">Sign Up Now</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

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
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;