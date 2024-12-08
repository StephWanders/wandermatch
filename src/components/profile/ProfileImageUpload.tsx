import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfilePicture {
  id?: string;
  image_url: string;
  is_default: boolean;
}

interface ProfileImageUploadProps {
  userId?: string;
  existingImages?: ProfilePicture[];
  onImagesUpdate?: (images: ProfilePicture[]) => void;
}

const ProfileImageUpload = ({ userId, existingImages = [], onImagesUpdate }: ProfileImageUploadProps) => {
  const [images, setImages] = useState<ProfilePicture[]>(existingImages);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !userId) return;

      setUploading(true);
      
      // Upload to Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Add to profile_pictures table
      const isFirstImage = images.length === 0;
      const { error: dbError, data: pictureData } = await supabase
        .from('profile_pictures')
        .insert({
          profile_id: userId,
          image_url: publicUrl,
          is_default: isFirstImage
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const updatedImages = [...images, pictureData];
      setImages(updatedImages);
      onImagesUpdate?.(updatedImages);
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (imageId: string) => {
    if (!userId) return;

    try {
      // First, set all images to non-default
      await supabase
        .from('profile_pictures')
        .update({ is_default: false })
        .eq('profile_id', userId);

      // Then set the selected image as default
      const { error } = await supabase
        .from('profile_pictures')
        .update({ is_default: true })
        .eq('id', imageId);

      if (error) throw error;

      const updatedImages = images.map(img => ({
        ...img,
        is_default: img.id === imageId
      }));

      setImages(updatedImages);
      onImagesUpdate?.(updatedImages);
      toast.success("Default profile picture updated!");
    } catch (error) {
      console.error('Error setting default image:', error);
      toast.error("Failed to update default profile picture");
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profile_pictures')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      onImagesUpdate?.(updatedImages);
      toast.success("Profile picture deleted successfully!");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete profile picture");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={image.image_url} alt="Profile" />
              <AvatarFallback className="bg-blue-100">
                <Camera className="h-8 w-8 text-blue-500" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 flex gap-1">
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => handleDelete(image.id!)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {!image.is_default && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs"
                onClick={() => handleSetDefault(image.id!)}
              >
                Set Default
              </Button>
            )}
          </div>
        ))}
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-blue-100">
              <Camera className="h-8 w-8 text-blue-500" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full"
            disabled={uploading}
            onClick={() => document.getElementById('imageUpload')?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Upload profile pictures. The first image will be set as default automatically.
      </p>
    </div>
  );
};

export default ProfileImageUpload;