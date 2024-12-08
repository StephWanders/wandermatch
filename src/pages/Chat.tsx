import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import BottomNav from "@/components/navigation/BottomNav";
import TopNav from "@/components/navigation/TopNav";
import { useMatchData } from "@/hooks/useMatchData";
import { useMessageData } from "@/hooks/useMessageData";
import { useAuthState } from "@/hooks/useAuthState";
import { useChatSubscription } from "@/hooks/useChatSubscription";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Match } from "@/types/match";
import { useLatestMessages } from "@/hooks/useMessageData";

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, profile, loading } = useAuthState();
  const [otherProfile, setOtherProfile] = useState(null);

  const { data: matches = [] } = useMatchData(session?.user?.id);
  const { data: messages = [] } = useMessageData(session?.user?.id, matchId, otherProfile?.id);
  const { data: latestMessages } = useLatestMessages(session?.user?.id, matches);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      navigate('/');
    }
  }, [session, navigate, loading]);

  // Sort matches by latest message time
  const sortedMatches = [...matches].sort((a, b) => {
    const timeA = latestMessages?.[a.id]?.time || a.matched_at || '';
    const timeB = latestMessages?.[b.id]?.time || b.matched_at || '';
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  // Navigate to most recent chat if no matchId is provided
  useEffect(() => {
    if (!matchId && sortedMatches.length > 0) {
      console.log('No matchId provided, navigating to most recent chat:', sortedMatches[0].id);
      navigate(`/chat/${sortedMatches[0].id}`, { replace: true });
    }
  }, [matchId, sortedMatches, navigate]);

  // Set other profile based on current match
  useEffect(() => {
    if (!session?.user?.id || !matchId) {
      console.log('Missing session or matchId:', { userId: session?.user?.id, matchId });
      return;
    }

    const currentMatch = sortedMatches.find(m => m.id === matchId);
    if (currentMatch) {
      console.log('Found match:', currentMatch);
      setOtherProfile(currentMatch.profiles);
    } else {
      console.log('Match not found:', matchId);
    }
  }, [matchId, sortedMatches, session?.user?.id]);

  useChatSubscription(matchId, session?.user?.id, otherProfile?.id, queryClient);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/90 backdrop-blur-[1px]" />
        </div>
      </div>

      <div className="relative z-10">
        <TopNav session={session} profile={profile} />
        <div className="h-[calc(100vh-128px)] flex mt-16">
          <ChatSidebar matches={sortedMatches} currentMatchId={matchId} />
          {matchId && otherProfile && (
            <ChatContainer 
              matchId={matchId}
              otherProfile={otherProfile}
              session={session}
              messages={messages}
            />
          )}
        </div>
        <BottomNav session={session} profile={profile} />
      </div>
    </div>
  );
};

export default Chat;