import ProfileAvatar from "@/components/profile/ProfileAvatar";

interface ChatHeaderProps {
  profile: any;
}

const ChatHeader = ({ profile }: ChatHeaderProps) => {
  if (!profile) return null;

  return (
    <div className="bg-white border-b p-4 flex items-center space-x-4">
      <ProfileAvatar
        imageUrl={profile.profile_image_url}
        name={profile.full_name}
      />
      <div>
        <h2 className="font-semibold">{profile.full_name}</h2>
        <p className="text-sm text-gray-500">{profile.travel_style}</p>
      </div>
    </div>
  );
};

export default ChatHeader;