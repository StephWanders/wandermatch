import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import HowItWorksSection from "./HowItWorksSection";
import FooterSection from "./FooterSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;