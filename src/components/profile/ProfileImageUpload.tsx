import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImagePreview from "./image-upload/ImagePreview";
import UploadButton from "./image-upload/UploadButton";

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
      if (!file || !userId) {
        toast.error("Please select a file to upload");
        return;
      }

      setUploading(true);
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Set is_default to true only if this is the first image
      const isFirstImage = images.length === 0;
      
      // First, update any existing default image if we're setting a new default
      if (isFirstImage && images.some(img => img.is_default)) {
        const { error: updateError } = await supabase
          .from('profile_pictures')
          .update({ is_default: false })
          .eq('profile_id', userId)
          .eq('is_default', true);

        if (updateError) throw updateError;
      }

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
      event.target.value = '';
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
      // First, remove default status from all images
      const { error: updateError } = await supabase
        .from('profile_pictures')
        .update({ is_default: false })
        .eq('profile_id', userId);

      if (updateError) throw updateError;

      // Then set the new default image
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
          <ImagePreview
            key={image.id}
            imageUrl={image.image_url}
            isDefault={image.is_default}
            onDelete={() => handleDelete(image.id!)}
            onSetDefault={() => handleSetDefault(image.id!)}
          />
        ))}
        <UploadButton 
          uploading={uploading}
          onFileSelect={handleFileUpload}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Upload profile pictures. The first image will be set as default automatically.
        Maximum file size: 5MB.
      </p>
    </div>
  );
};

export default ProfileImageUpload;