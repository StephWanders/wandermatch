import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Shield, MessageSquare, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469041797191-50ace28483c3')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Find Your Perfect Travel Companion
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with like-minded travelers who share your passion for exploration and adventure.
          </p>
          <Button size="lg" className="animate-bounce" asChild>
            <Link to="/create-profile">Start Matching</Link>
          </Button>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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
      <section className="py-24 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <Card className="max-w-2xl mx-auto border-none bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Join thousands of travelers finding their perfect travel companions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" asChild>
              <Link to="/create-profile">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary hover:bg-primary/5">
              Learn More
            </Button>
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-primary group-hover:text-purple-600 transition-colors" />
        </div>
        <CardTitle className="text-xl text-center group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;