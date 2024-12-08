import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { MessageCircle, X, Check, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchCardProps {
  match: any;
  isPending?: boolean;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
  onChatClick?: (matchId: string) => void;
}

const MatchCard = ({ match, isPending, onAccept, onDecline, onChatClick }: MatchCardProps) => {
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get the current user's ID when the component mounts
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUserId(session.user.id);
      }
    });
  });

  // Determine which profile to show based on the current user's ID
  const matchedProfile = currentUserId === match.profile1_id ? 
    match.profiles : // If current user is profile1, show profile2's data
    match.profiles; // If current user is profile2, show profile1's data

  const handleChatClick = async () => {
    try {
      console.log('Initializing chat with match:', match.id);
      
      // Update match status to ensure it's marked as active
      const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'active' })
        .eq('id', match.id)
        .single();

      if (updateError) {
        console.error('Error updating match status:', updateError);
        toast.error("Failed to initialize chat");
        return;
      }

      console.log('Chat initialized successfully');
      navigate(`/chat/${match.id}`);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error("Failed to initialize chat");
    }
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-4 cursor-pointer"
              onClick={handleProfileClick}
            >
              <ProfileAvatar
                imageUrl={matchedProfile.profile_image_url}
                name={matchedProfile.full_name}
              />
              <div>
                <h3 className="font-semibold">{matchedProfile.full_name}</h3>
                <p className="text-sm text-gray-500">{matchedProfile.location}</p>
              </div>
            </div>
            {isPending && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDecline?.(match.id)}
                  className="hover:bg-red-50"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onAccept?.(match.id)}
                  className="hover:bg-green-50"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
              </div>
            )}
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
          
          {!isPending && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> {matchedProfile.travel_style}
                </span>
              </div>
              <Button 
                onClick={handleChatClick}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileModal 
        profile={matchedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default MatchCard;