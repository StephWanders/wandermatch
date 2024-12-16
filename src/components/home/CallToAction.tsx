import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504893524553-b855bce32c67')] bg-cover bg-center opacity-10" />
      <Card className="max-w-2xl mx-auto border-none bg-white/50 backdrop-blur-sm card-hover">
        <CardHeader>
          <CardTitle className="text-3xl text-center gradient-text font-display">
            Ready to Start Your Journey?
          </CardTitle>
          <CardDescription className="text-center text-lg font-body">
            Join thousands of travelers finding their perfect travel companions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button
            size="lg"
            className="gradient-bg hover:opacity-90 transition-opacity duration-300 text-white"
            asChild
          >
            <Link to="/?view=sign_up">Sign Up Now</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-[#2fcab7] border-none text-white"
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default CallToAction;