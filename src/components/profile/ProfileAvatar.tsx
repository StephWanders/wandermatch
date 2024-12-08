import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  className?: string;
}

const ProfileAvatar = ({ imageUrl, name, className }: ProfileAvatarProps) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl || ""} alt={name || "Profile"} />
      <AvatarFallback className="bg-blue-100">
        {initials || <User className="h-4 w-4 text-blue-500" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;