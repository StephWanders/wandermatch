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

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, profile, loading } = useAuthState();
  const [otherProfile, setOtherProfile] = useState(null);

  const { data: matches = [], isError: matchesError } = useMatchData(session?.user?.id);
  const { data: messages = [] } = useMessageData(session?.user?.id, matchId, otherProfile?.id);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      navigate('/');
    }
  }, [session, navigate, loading]);

  // Navigate to most recent chat if no matchId is provided
  useEffect(() => {
    if (!matchId && matches.length > 0) {
      console.log('No matchId provided, navigating to most recent chat');
      const sortedMatches = [...matches].sort((a, b) => {
        const timeA = new Date(a.matched_at || a.profiles.created_at || '').getTime();
        const timeB = new Date(b.matched_at || b.profiles.created_at || '').getTime();
        return timeB - timeA;
      });
      navigate(`/chat/${sortedMatches[0].id}`, { replace: true });
    }
  }, [matchId, matches, navigate]);

  // Set other profile based on current match
  useEffect(() => {
    if (!session?.user?.id || !matchId || !matches?.length) return;
    
    console.log('Setting other profile for match:', matchId);
    const currentMatch = matches.find(m => m.id === matchId);
    
    if (currentMatch) {
      // If current user is profile1, use profile2's data from profiles
      // If current user is profile2, use profile1's data from profiles
      const otherProfileId = currentMatch.profile1_id === session.user.id 
        ? currentMatch.profile2_id 
        : currentMatch.profile1_id;
      
      // Find the match that contains the other profile's data
      const matchWithOtherProfile = matches.find(m => m.profiles.id === otherProfileId);
      
      if (matchWithOtherProfile) {
        console.log('Other profile set:', matchWithOtherProfile.profiles);
        setOtherProfile(matchWithOtherProfile.profiles);
      }
    }
  }, [matchId, matches, session?.user?.id]);

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

  if (matchesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-display font-semibold text-accent-800 mb-2">
            Unable to load chat
          </h2>
          <p className="font-body text-accent-600">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
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
          <ChatSidebar matches={matches as Match[]} currentMatchId={matchId} />
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