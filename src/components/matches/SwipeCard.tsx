import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProfileModal from "./ProfileModal";

interface SwipeCardProps {
  profile: any;
  onSwipe: () => void;
  currentUserId: string;
}

const SwipeCard = ({ profile, onSwipe, currentUserId }: SwipeCardProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSwipe = async (action: 'like' | 'dislike') => {
    try {
      const { error } = await supabase
        .from('potential_matches')
        .insert({
          user_id: currentUserId,
          target_id: profile.id,
          action: action
        });

      if (error) throw error;
      
      if (action === 'like') {
        toast.success("Profile liked!");
      }
      
      onSwipe();
      // Refresh the page after recording the swipe
      window.location.reload();
    } catch (error) {
      console.error('Error recording swipe:', error);
      toast.error("Failed to record preference");
    }
  };

  return (
    <>
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6">
          <div 
            className="cursor-pointer"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-4">
              {profile.profile_image_url && (
                <img 
                  src={profile.profile_image_url} 
                  alt={profile.full_name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">{profile.full_name}</h3>
            <p className="text-gray-600 mb-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {profile.interests?.slice(0, 5).map((interest: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSwipe('dislike')}
              className="w-32"
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              Pass
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={() => handleSwipe('like')}
              className="w-32 bg-green-600 hover:bg-green-700"
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Like
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProfileModal 
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default SwipeCard;