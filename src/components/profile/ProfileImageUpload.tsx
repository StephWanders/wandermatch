import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (userId) {
      console.log('Fetching profile pictures for user:', userId);
      fetchProfilePictures();
    }
  }, [userId]);

  const fetchProfilePictures = async () => {
    try {
      if (!userId) return;
      console.log('Fetching profile pictures for user:', userId);
      
      const { data, error } = await supabase
        .from('profile_pictures')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log('Fetched profile pictures:', data);
      setImages(data || []);
      onImagesUpdate?.(data || []);
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
      toast.error("Failed to load profile pictures");
    }
  };

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

      try {
        // If this will be the default image, first update existing default
        if (isFirstImage) {
          const { error: updateError } = await supabase
            .from('profile_pictures')
            .update({ is_default: false })
            .eq('profile_id', userId)
            .eq('is_default', true);

          if (updateError && !updateError.message.includes('no rows')) {
            throw updateError;
          }
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

        console.log('New profile picture added:', pictureData);
        const updatedImages = [...images, pictureData];
        setImages(updatedImages);
        onImagesUpdate?.(updatedImages);
        
        toast.success("Profile picture uploaded successfully!");
      } catch (error: any) {
        // If there was an error inserting the image, clean up the uploaded file
        await supabase.storage
          .from('profile-pictures')
          .remove([filePath]);
        throw error;
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSetDefault = async (imageId: string) => {
    if (!userId) return;

    try {
      console.log('Setting default image:', imageId);
      
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

      console.log('Updated images after setting default:', updatedImages);
      setImages(updatedImages);
      onImagesUpdate?.(updatedImages);
      toast.success("Default profile picture updated!");
    } catch (error: any) {
      console.error('Error setting default image:', error);
      toast.error("Failed to update default profile picture");
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!userId) return;

    try {
      console.log('Deleting image:', imageId);
      const { error } = await supabase
        .from('profile_pictures')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      const updatedImages = images.filter(img => img.id !== imageId);
      console.log('Updated images after deletion:', updatedImages);
      setImages(updatedImages);
      onImagesUpdate?.(updatedImages);
      toast.success("Profile picture deleted successfully!");
    } catch (error: any) {
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