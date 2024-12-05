import { useState } from "react";
import TravelForm from "@/components/TravelForm";
import TravelResults from "@/components/TravelResults";
import InspirationSection from "@/components/InspirationSection";
import SeasonalSection from "@/components/SeasonalSection";
import LocalEventsSection from "@/components/LocalEventsSection";

const Index = () => {
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = (data: any) => {
    setSearchResults(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div 
        className="h-[50vh] bg-cover bg-center relative"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80)',
          backgroundPosition: 'center 60%'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-4">
            Discover amazing destinations and create unforgettable memories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <TravelForm onSearch={handleSearch} />
        
        {searchResults && (
          <>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Travel Options for {searchResults.location}
              </h2>
              <TravelResults data={searchResults} />
            </div>
            <LocalEventsSection location={searchResults.location} />
          </>
        )}

        <InspirationSection />
        <SeasonalSection />
      </div>
    </div>
  );
};

export default Index;