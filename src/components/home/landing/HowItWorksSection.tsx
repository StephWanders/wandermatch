import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Users, Plane } from "lucide-react";

const steps = [
  {
    icon: UserCircle,
    title: "Create Your Profile",
    description: "Tell us about your travel style, interests, and dream destinations."
  },
  {
    icon: Users,
    title: "Find a Match or Join a Group",
    description: "Connect with like-minded travelers or join existing travel groups."
  },
  {
    icon: Plane,
    title: "Plan and Travel Together",
    description: "Coordinate your journey and create unforgettable memories together."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">
          How WanderMatch Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <div className="absolute top-0 left-0 w-12 h-12 bg-orange-500 text-white flex items-center justify-center text-xl font-bold rounded-br-lg">
                {index + 1}
              </div>
              <CardContent className="p-6 pt-16 text-center">
                <step.icon className="w-16 h-16 mx-auto mb-4 text-teal-600" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;