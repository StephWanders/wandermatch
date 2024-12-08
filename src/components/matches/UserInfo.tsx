import ProfileAvatar from "@/components/profile/ProfileAvatar";
import UserRating from "./UserRating";

interface UserInfoProps {
  profile: any;
  onClick: () => void;
}

const UserInfo = ({ profile, onClick }: UserInfoProps) => {
  return (
    <div 
      className="flex items-center space-x-4 cursor-pointer"
      onClick={onClick}
    >
      <ProfileAvatar
        imageUrl={profile.profile_image_url}
        name={profile.full_name}
      />
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{profile.full_name}</h3>
          <UserRating userId={profile.id} />
        </div>
        <p className="text-sm text-gray-500">{profile.location}</p>
      </div>
    </div>
  );
};

export default UserInfo;