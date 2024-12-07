import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNav from "@/components/navigation/BottomNav";
import ProfileAvatar from "@/components/profile/ProfileAvatar";

const Chat = () => {
  const { matchId } = useParams();
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

  const fetchProfile = async (userId) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      setProfile(profileData);

      // Fetch other profile in the match
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
    <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="fixed top-0 w-full bg-white border-b z-10 p-4">
        <div className="flex items-center space-x-4">
          <ProfileAvatar
            imageUrl={otherProfile?.profile_image_url}
            name={otherProfile?.full_name}
          />
          <div>
            <h2 className="font-semibold">{otherProfile?.full_name}</h2>
            <p className="text-sm text-gray-500">{otherProfile?.travel_style}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)] mt-16 px-4">
        <div className="space-y-4 py-4">
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

      <form
        onSubmit={sendMessage}
        className="fixed bottom-20 left-0 right-0 bg-white border-t p-4"
      >
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>

      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Chat;