import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import BottomNav from "@/components/navigation/BottomNav";
import { useMatchData } from "@/hooks/useMatchData";
import { useMessageData } from "@/hooks/useMessageData";
import { useChatState } from "@/hooks/useChatState";
import { useChatSubscription } from "@/hooks/useChatSubscription";

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, profile } = useChatState();
  const [otherProfile, setOtherProfile] = useState(null);

  const { data: matches = [], isError: matchesError } = useMatchData(session?.user?.id);
  const { data: messages = [] } = useMessageData(session?.user?.id, matchId, otherProfile?.id);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    const updateOtherProfile = async () => {
      if (!session?.user?.id || !matchId || !matches?.length) return;
      
      const currentMatch = matches.find(m => m.id === matchId);
      if (currentMatch) {
        setOtherProfile(currentMatch.profiles);
      }
    };

    updateOtherProfile();
  }, [matchId, matches, session?.user?.id]);

  useChatSubscription(matchId, session?.user?.id, otherProfile?.id, queryClient);

  if (!session) {
    return <div>Loading...</div>;
  }

  if (matchesError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load chat
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="h-[calc(100vh-64px)] flex">
        <ChatSidebar matches={matches || []} currentMatchId={matchId} />
        <ChatContainer 
          matchId={matchId!}
          otherProfile={otherProfile}
          session={session}
          messages={messages}
        />
      </div>
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Chat;