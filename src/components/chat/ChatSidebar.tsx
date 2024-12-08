import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { useLatestMessages } from "@/hooks/useMessageData";
import { useEffect, useState } from "react";

interface ChatSidebarProps {
  matches: any[];
  currentMatchId?: string;
}

const ChatSidebar = ({ matches, currentMatchId }: ChatSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
      }
    });
  }, []);

  const { data: latestMessages } = useLatestMessages(currentUserId || undefined, matches);

  const handleUnmatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'unmatched' })
        .eq('id', matchId);

      if (error) throw error;

      toast.success("Successfully unmatched");
      navigate('/matches');
    } catch (error) {
      console.error("Error unmatching:", error);
      toast.error("Failed to unmatch");
    }
  };

  // Sort matches by latest message time
  const sortedMatches = [...(matches || [])].sort((a, b) => {
    const timeA = latestMessages?.[a.id]?.time || a.matched_at;
    const timeB = latestMessages?.[b.id]?.time || b.matched_at;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  // Select most recent chat when navigating to /chat
  useEffect(() => {
    const isOnChatRoute = location.pathname === '/chat';
    const hasNoMatchSelected = !currentMatchId;
    const hasMatches = sortedMatches.length > 0;
    const showLatest = location.state?.showLatest;
    
    if ((isOnChatRoute || hasNoMatchSelected || showLatest) && hasMatches) {
      const mostRecentMatchId = sortedMatches[0].id;
      navigate(`/chat/${mostRecentMatchId}`, { 
        replace: true,
        state: { ...location.state, showLatest: false }
      });
    }
  }, [location.pathname, location.state, currentMatchId, sortedMatches, navigate]);

  return (
    <div className="w-80 bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Your Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        {sortedMatches?.map((match) => {
          const chatProfile = match.profiles;
          const latestMessage = latestMessages?.[match.id]?.message;
          
          return (
            <div
              key={match.id}
              className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                match.id === currentMatchId ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                  onClick={() => navigate(`/chat/${match.id}`)}
                >
                  <ProfileAvatar
                    imageUrl={chatProfile.profile_image_url}
                    name={chatProfile.full_name}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{chatProfile.full_name}</h3>
                    <p className="text-sm text-gray-500 truncate">
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
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unmatch User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to unmatch with {chatProfile.full_name}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUnmatch(match.id)}
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
        })}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;