import StatsSection from "./welcome/StatsSection";
import LocationContent from "./welcome/LocationContent";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session, profile }: WelcomeSectionProps) => {
  return (
    <div className="relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold font-display text-accent-800 mb-6">
          Your Dashboard
        </h2>

        <StatsSection userId={session?.user?.id} />
        
        <LocationContent location={profile?.location} />
        
        <InspirationSection />
        
        <SeasonalSection />
      </div>
    </div>
  );
};

export default WelcomeSection;