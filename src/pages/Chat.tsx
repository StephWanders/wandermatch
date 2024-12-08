import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/ChatSidebar";
import BottomNav from "@/components/navigation/BottomNav";

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
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const { data: matches } = useQuery({
    queryKey: ['chat-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      console.log('Fetching matches for chat');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_profile2_id_fkey(*)
        `)
        .or(`profile1_id.eq.${session.user.id}`)
        .eq('status', 'accepted');
      
      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Separate query for messages
  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages', matchId],
    queryFn: async () => {
      if (!session?.user?.id || !matchId || !otherProfile?.id) return [];
      console.log('Fetching messages for match:', matchId);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${session.user.id},receiver_id.eq.${otherProfile.id}),`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id && !!matchId && !!otherProfile?.id,
  });

  // Effect to update otherProfile when matchId changes
  useEffect(() => {
    const updateOtherProfile = async () => {
      if (!session?.user?.id || !matchId || !matches) return;
      
      const currentMatch = matches.find(m => m.id === matchId);
      if (currentMatch) {
        const otherProfileId = currentMatch.profile1_id === session.user.id 
          ? currentMatch.profile2_id 
          : currentMatch.profile1_id;
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherProfileId)
          .single();
          
        if (profileData) {
          console.log('Setting other profile:', profileData);
          setOtherProfile(profileData);
        }
      }
    };

    updateOtherProfile();
  }, [matchId, matches, session?.user?.id]);

  // Subscribe to new messages
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
            // Invalidate and refetch messages query
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
      
      // Invalidate and refetch messages after sending
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
