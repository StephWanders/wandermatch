import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { UserMinus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatPreviewCardProps {
  profile: any;
  isActive: boolean;
  latestMessage?: string;
  onClick: () => void;
  onUnmatch: () => void;
}

const ChatPreviewCard = ({
  profile,
  isActive,
  latestMessage,
  onClick,
  onUnmatch
}: ChatPreviewCardProps) => {
  return (
    <div
      className={`p-4 transition-all duration-200 hover:bg-primary-50/50 ${
        isActive ? "bg-primary-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer flex-1"
          onClick={onClick}
        >
          <ProfileAvatar
            imageUrl={profile.profile_image_url}
            name={profile.full_name}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-medium text-accent-800 truncate">
              {profile.full_name}
            </h3>
            <p className="text-sm font-body text-accent-600 truncate">
              {latestMessage}
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="font-body">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">Unmatch User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unmatch with {profile.full_name}? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onUnmatch}
                className="bg-red-500 hover:bg-red-600"
              >
                Unmatch
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ChatPreviewCard;