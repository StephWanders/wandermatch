import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import ProfileModal from "./ProfileModal";
import RatingForm from "./RatingForm";
import UserInfo from "./UserInfo";
import MatchActions from "./MatchActions";
import { useAuthState } from "@/hooks/useAuthState";

interface MatchCardProps {
  match: any;
  isPending?: boolean;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
}

const MatchCard = ({ match, isPending, onAccept, onDecline }: MatchCardProps) => {
  const navigate = useNavigate();
  const { session } = useAuthState();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Determine which profile ID to query based on the current user
  const otherProfileId = match.profile1_id === session?.user?.id ? match.profile2_id : match.profile1_id;

  // Get the profile of the other user
  const { data: matchedProfile, isError, isLoading } = useQuery({
    queryKey: ['profile', otherProfileId],
    queryFn: async () => {
      console.log('Fetching profile for ID:', otherProfileId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherProfileId)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        console.log('No profile found for ID:', otherProfileId);
        return null;
      }

      console.log('Found profile:', data);
      return data;
    },
    enabled: !!otherProfileId,
    retry: false // Don't retry if profile doesn't exist
  });

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow animate-fade-in">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    console.error('Error in MatchCard:', isError);
    return (
      <Card className="hover:shadow-lg transition-shadow animate-fade-in">
        <CardContent className="p-6">
          <p className="text-red-600">Failed to load match details</p>
        </CardContent>
      </Card>
    );
  }

  if (!matchedProfile) {
    console.log('No matched profile found');
    return (
      <Card className="hover:shadow-lg transition-shadow animate-fade-in">
        <CardContent className="p-6">
          <p className="text-gray-600">Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <UserInfo 
              profile={matchedProfile}
              onClick={() => setIsProfileModalOpen(true)}
            />
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 line-clamp-2">{matchedProfile.bio}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {matchedProfile.interests?.slice(0, 3).map((interest: string, index: number) => (
                <span
                  key={`${interest}-${index}`}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" /> {matchedProfile.travel_style}
              </span>
            </div>
            {isPending ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onDecline?.(match.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Decline
                </button>
                <button
                  onClick={() => onAccept?.(match.id)}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Accept
                </button>
              </div>
            ) : (
              <MatchActions 
                matchId={match.id}
                onRateClick={() => setIsRatingModalOpen(true)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <ProfileModal 
        profile={matchedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <RatingForm
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        matchId={match.id}
        ratedUserId={matchedProfile.id}
      />
    </>
  );
};

export default MatchCard;