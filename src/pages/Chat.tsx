import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/ChatSidebar";

const Chat = () => {
  const { matchId } = useParams();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherProfile, setOtherProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMessages();
      }
    });

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${session?.user?.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [matchId]);

  const { data: matches } = useQuery({
    queryKey: ['chat-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_profile2_id_fkey(*)
        `)
        .or(`profile1_id.eq.${session.user.id},profile2_id.eq.${session.user.id}`)
        .eq('status', 'accepted');
      
      if (matchId && data) {
        const currentMatch = data.find(m => m.id === matchId);
        if (currentMatch) {
          setOtherProfile(currentMatch.profiles);
        }
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${session?.user?.id},receiver_id.eq.${session?.user?.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (content: string) => {
    if (!otherProfile) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: session.user.id,
        receiver_id: otherProfile.id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="h-screen flex">
        <ChatSidebar matches={matches || []} currentMatchId={matchId} />
        
        <div className="flex-1 flex flex-col">
          <ChatHeader profile={otherProfile} />
          
          <ChatMessages 
            messages={messages} 
            currentUserId={session?.user?.id} 
          />
          
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;