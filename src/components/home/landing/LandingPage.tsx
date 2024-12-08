import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import HowItWorksSection from "./HowItWorksSection";
import FooterSection from "./FooterSection";
import TopNav from "./TopNav";
import AuthSection from "../AuthSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen pt-16">
      <TopNav />
      <HeroSection />
      <AuthSection />
      <FeaturesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;