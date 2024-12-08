import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/ChatSidebar";
import BottomNav from "@/components/navigation/BottomNav";
import { useMatchData } from "@/hooks/useMatchData";
import { useMessageData } from "@/hooks/useMessageData";

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [otherProfile, setOtherProfile] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const { data: matches = [], isError: matchesError } = useMatchData(session?.user?.id);
  const { data: messages = [] } = useMessageData(session?.user?.id, matchId, otherProfile?.id);

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

  useEffect(() => {
    if (!session?.user?.id || !matchId || !otherProfile?.id) return;

    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('Message change received:', payload);
          if (payload.eventType === 'INSERT') {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', matchId] });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [matchId, session?.user?.id, otherProfile?.id, queryClient]);

  const sendMessage = async (content: string) => {
    if (!session?.user?.id || !otherProfile?.id) {
      console.error('Missing user or recipient information');
      return;
    }

    try {
      console.log('Sending message to:', otherProfile.id);
      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: session.user.id,
        receiver_id: otherProfile.id,
      });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['chat-messages', matchId] });
      console.log('Message sent successfully');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

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
        <div className="flex-1 flex flex-col">
          <ChatHeader profile={otherProfile} />
          <ChatMessages messages={messages} currentUserId={session?.user?.id} />
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Chat;