import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { MessageCircle, X, Check, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MatchCardProps {
  match: any;
  isPending?: boolean;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
  onChatClick?: (matchId: string) => void;
}

const MatchCard = ({ match, isPending, onAccept, onDecline, onChatClick }: MatchCardProps) => {
  const matchedProfile = isPending ? match.profiles : match.profiles;

  return (
    <Card className="hover:shadow-lg transition-shadow animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
              onClick={() => onChatClick?.(match.id)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;