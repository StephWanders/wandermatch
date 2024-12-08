import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProfilePicture {
  id: string;
  image_url: string;
  is_default: boolean;
}

export const useProfilePictures = (userId: string | undefined) => {
  const [profilePictures, setProfilePictures] = useState<ProfilePicture[]>([]);

  const fetchProfilePictures = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching profile pictures for user:', userId);
      const { data, error } = await supabase
        .from('profile_pictures')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log('Fetched profile pictures:', data);
      setProfilePictures(data || []);
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
      toast.error("Failed to load profile pictures");
    }
  };

  const updateProfileImageUrl = async (userId: string, imageUrl: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image_url: imageUrl })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile image URL:', error);
      toast.error("Failed to update profile image");
    }
  };

  const handleImagesUpdate = async (updatedImages: ProfilePicture[]) => {
    console.log('Updating images:', updatedImages);
    setProfilePictures(updatedImages);
    
    // Update profile's main image URL if there's a default image
    const defaultImage = updatedImages.find(img => img.is_default);
    if (userId) {
      await updateProfileImageUrl(userId, defaultImage?.image_url || null);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfilePictures();
    }
  }, [userId]);

  return {
    profilePictures,
    handleImagesUpdate,
    fetchProfilePictures
  };
};