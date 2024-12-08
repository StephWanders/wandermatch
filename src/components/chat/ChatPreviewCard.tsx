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
import { Badge } from "@/components/ui/badge";

interface ChatPreviewCardProps {
  profile: any;
  isActive: boolean;
  latestMessage?: string;
  onClick: () => void;
  onUnmatch: () => void;
  unreadCount?: number;
}

const ChatPreviewCard = ({
  profile,
  isActive,
  latestMessage,
  onClick,
  onUnmatch,
  unreadCount = 0
}: ChatPreviewCardProps) => {
  return (
    <div
      className={`p-4 transition-all duration-200 hover:bg-primary-50/50 ${
        isActive ? "bg-primary-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div 
          className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
          onClick={onClick}
        >
          <ProfileAvatar
            imageUrl={profile.profile_image_url}
            name={profile.full_name}
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-medium text-accent-800 truncate">
                {profile.full_name}
              </h3>
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="bg-primary-500 text-white flex-shrink-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <p className="text-sm font-body text-accent-600 truncate">
              {latestMessage || "No messages yet"}
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 h-8 w-8"
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