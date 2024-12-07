import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNav from "@/components/navigation/BottomNav";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { useQuery } from "@tanstack/react-query";

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherProfile, setOtherProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchMessages();
      }
    });

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
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const fetchProfile = async (userId) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      setProfile(profileData);

      if (matchId) {
        const { data: matchData } = await supabase
          .from("matches")
          .select("*")
          .eq("id", matchId)
          .single();

        if (matchData) {
          const otherProfileId = matchData.profile1_id === userId 
            ? matchData.profile2_id 
            : matchData.profile1_id;

          const { data: otherProfileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", otherProfileId)
            .single();

          setOtherProfile(otherProfileData);
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${session?.user?.id},receiver_id.eq.${session?.user?.id}`)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: newMessage.trim(),
        sender_id: session.user.id,
        receiver_id: otherProfile.id,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="h-screen flex">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Your Chats</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-64px)]">
            {matches?.map((match) => {
              const chatProfile = match.profiles;
              return (
                <div
                  key={match.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    match.id === matchId ? "bg-blue-50" : ""
                  }`}
                  onClick={() => navigate(`/chat/${match.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar
                      imageUrl={chatProfile.profile_image_url}
                      name={chatProfile.full_name}
                    />
                    <div>
                      <h3 className="font-medium">{chatProfile.full_name}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {chatProfile.travel_style}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {otherProfile && (
            <div className="bg-white border-b p-4 flex items-center space-x-4">
              <ProfileAvatar
                imageUrl={otherProfile.profile_image_url}
                name={otherProfile.full_name}
              />
              <div>
                <h2 className="font-semibold">{otherProfile.full_name}</h2>
                <p className="text-sm text-gray-500">{otherProfile.travel_style}</p>
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === session?.user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_id === session?.user?.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form
            onSubmit={sendMessage}
            className="bg-white border-t p-4 flex items-center space-x-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;