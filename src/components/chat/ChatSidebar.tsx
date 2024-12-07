import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { useNavigate } from "react-router-dom";

interface ChatSidebarProps {
  matches: any[];
  currentMatchId?: string;
}

const ChatSidebar = ({ matches, currentMatchId }: ChatSidebarProps) => {
  const navigate = useNavigate();

  return (
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
                match.id === currentMatchId ? "bg-blue-50" : ""
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
  );
};

export default ChatSidebar;