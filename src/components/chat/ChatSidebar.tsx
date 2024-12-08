import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLatestMessages } from "@/hooks/useMessageData";
import { useEffect, useState } from "react";
import ChatPreviewCard from "./ChatPreviewCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Match } from "@/types/match";

interface ChatSidebarProps {
  matches: Match[];
  currentMatchId?: string;
}

const ChatSidebar = ({ matches, currentMatchId }: ChatSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
      }
    });
  }, []);

  const { data: latestMessages } = useLatestMessages(currentUserId || undefined, matches);

  const { data: unreadCounts = {} } = useQuery({
    queryKey: ['unread-counts', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return {};
      
      const { data: messages, error } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', currentUserId)
        .is('read_at', null);

      if (error) {
        console.error('Error fetching unread counts:', error);
        return {};
      }

      const counts = messages?.reduce((acc: Record<string, number>, msg) => {
        const senderId = msg.sender_id;
        acc[senderId] = (acc[senderId] || 0) + 1;
        return acc;
      }, {}) || {};

      return counts;
    },
    enabled: !!currentUserId,
    refetchInterval: 3000
  });

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

  // Filter matches to only show active ones where the current user is profile1
  const activeMatches = matches.filter(match => 
    match.status === 'active' && 
    match.profile1_id === currentUserId
  );

  // Sort matches by latest message time
  const sortedMatches = [...activeMatches].sort((a, b) => {
    const timeA = latestMessages?.[a.id]?.time || a.matched_at || '';
    const timeB = latestMessages?.[b.id]?.time || b.matched_at || '';
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  // Navigate to most recent chat if on base chat route
  useEffect(() => {
    if (location.pathname === '/chat' && sortedMatches.length > 0) {
      const mostRecentMatch = sortedMatches[0];
      console.log('Navigating to most recent active match:', mostRecentMatch);
      navigate(`/chat/${mostRecentMatch.id}`, { replace: true });
    }
  }, [location.pathname, sortedMatches, navigate]);

  return (
    <div className="w-80 bg-white/40 backdrop-blur-md border-r border-primary-100 flex flex-col h-full">
      <div className="p-4 border-b border-primary-100">
        <h2 className="font-display text-xl font-semibold text-accent-800">Your Chats</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {sortedMatches.map((match) => {
            const otherProfile = match.profiles;
            const otherProfileId = match.profile2_id;
              
            return (
              <ChatPreviewCard
                key={match.id}
                profile={otherProfile}
                isActive={match.id === currentMatchId}
                latestMessage={latestMessages?.[match.id]?.message}
                onClick={() => navigate(`/chat/${match.id}`)}
                onUnmatch={() => handleUnmatch(match.id)}
                unreadCount={unreadCounts[otherProfileId] || 0}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;