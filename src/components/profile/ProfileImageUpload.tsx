import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const ProfileImageUpload = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback className="bg-blue-100">
            <Camera className="h-8 w-8 text-blue-500" />
          </AvatarFallback>
        </Avatar>
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute bottom-0 right-0 rounded-full"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageUpload;