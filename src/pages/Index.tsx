import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Shield, MessageSquare, Calendar, MapPin, Home, Heart, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-display">
            Find Your Perfect Travel Companion
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
            Connect with like-minded travelers who share your passion for exploration and adventure.
          </p>
          <Button 
            size="lg" 
            className="animate-bounce bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300" 
            asChild
          >
            <Link to="/create-profile">Start Matching</Link>
          </Button>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-display">
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
      <section className="py-24 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <Card className="max-w-2xl mx-auto border-none bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-display">
              Ready to Start Your Journey?
            </CardTitle>
            <CardDescription className="text-center text-lg font-body">
              Join thousands of travelers finding their perfect travel companions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300" 
              asChild
            >
              <Link to="/create-profile">Sign Up Now</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center z-50">
        <NavButton icon={Home} label="Home" active />
        <NavButton icon={Heart} label="Matches" />
        <NavButton icon={MessageCircle} label="Chat" />
        <NavButton icon={User} label="Profile" />
      </nav>
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
        <div className="mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-blue-600 group-hover:text-green-600 transition-colors" />
        </div>
        <CardTitle className="text-xl text-center group-hover:text-blue-600 transition-colors font-display">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground font-body">{description}</p>
      </CardContent>
    </Card>
  );
};

const NavButton = ({ 
  icon: Icon, 
  label, 
  active 
}: { 
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) => {
  return (
    <button className={`flex flex-col items-center space-y-1 ${active ? 'text-blue-600' : 'text-gray-600'}`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default Index;