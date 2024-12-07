import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MapPin, Globe, Book } from "lucide-react";

interface ProfileModalProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ profile, isOpen, onClose }: ProfileModalProps) => {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{profile.full_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
            {profile.profile_image_url && (
              <img 
                src={profile.profile_image_url} 
                alt={profile.full_name}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{profile.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="h-4 w-4" />
                <span>{profile.travel_style || 'Travel style not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <span>{profile.languages?.join(', ') || 'Languages not specified'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Book className="h-4 w-4" /> Bio
              </h4>
              <p className="text-gray-600">{profile.bio || 'No bio provided'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests?.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Preferred Destinations</h4>
            <div className="flex flex-wrap gap-2">
              {profile.preferred_destinations?.map((destination: string, index: number) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {destination}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;