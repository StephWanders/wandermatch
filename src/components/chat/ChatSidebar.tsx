import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLatestMessages } from "@/hooks/useMessageData";
import { useEffect, useState } from "react";
import ChatPreviewCard from "./ChatPreviewCard";

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
    <div className="w-80 bg-white/95 backdrop-blur-md border-r border-primary-100">
      <div className="p-4 border-b border-primary-100">
        <h2 className="font-display text-xl font-semibold text-accent-800">Your Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        {sortedMatches?.map((match) => (
          <ChatPreviewCard
            key={match.id}
            profile={match.profiles}
            isActive={match.id === currentMatchId}
            latestMessage={latestMessages?.[match.id]?.message}
            onClick={() => navigate(`/chat/${match.id}`)}
            onUnmatch={() => handleUnmatch(match.id)}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;