import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { useLatestMessages } from "@/hooks/useMessageData";

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Filter to only show active matches where the current user is profile1
  const activeMatches = matches.filter(match => 
    match.status === 'active' && 
    match.profile1_id === session?.user?.id
  );

  // Sort matches by latest message
  const sortedMatches = [...activeMatches].sort((a, b) => {
    const timeA = latestMessages?.[a.id]?.time || a.matched_at;
    const timeB = latestMessages?.[b.id]?.time || b.matched_at;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  // Navigate to most recent chat if on base chat route
  useEffect(() => {
    if (location.pathname === '/chat' && sortedMatches.length > 0) {
      const mostRecentMatch = sortedMatches[0];
      console.log('Navigating to most recent match:', mostRecentMatch);
      navigate(`/chat/${mostRecentMatch.id}`, { replace: true });
    }
  }, [location.pathname, sortedMatches, navigate]);

  // Set other profile based on current match
  useEffect(() => {
    if (!session?.user?.id || !matchId) {
      console.log('Missing session or matchId:', { userId: session?.user?.id, matchId });
      return;
    }

    const currentMatch = sortedMatches.find(m => m.id === matchId);
    if (currentMatch) {
      console.log('Found match:', currentMatch, 'Setting other profile');
      setOtherProfile(currentMatch.profiles);
    } else {
      console.log('Match not found:', matchId);
      // If match not found, navigate to the most recent match
      if (sortedMatches.length > 0) {
        console.log('Redirecting to most recent match');
        navigate(`/chat/${sortedMatches[0].id}`, { replace: true });
      }
    }
  }, [matchId, sortedMatches, session?.user?.id, navigate]);

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
    <div className="min-h-screen pb-20 relative">
      {/* Background Image with Overlay */}
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

      {/* Content */}
      <div className="relative z-10">
        <TopNav session={session} profile={profile} />
        <div className="pt-16 h-[calc(100vh-9rem)]">
          <div className="h-full flex">
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
        </div>
        <BottomNav session={session} profile={profile} />
      </div>
    </div>
  );
};

export default Chat;