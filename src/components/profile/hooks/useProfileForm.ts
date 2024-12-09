import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormValues, profileFormSchema } from "../ProfileSchema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileForm = (profile: any, session: any, onProfileUpdate: () => void) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.full_name || "",
      age: profile?.age?.toString() || "",
      travelStyle: profile?.travel_style || "",
      bio: profile?.bio || "",
      interests: profile?.interests?.join(", ") || "",
      languages: profile?.languages?.join(", ") || "",
      preferredDestinations: profile?.preferred_destinations?.join(", ") || "",
      gender: profile?.gender || "",
      preferredGender: profile?.preferred_gender?.join(", ") || "",
      profileImage: profile?.profile_image_url || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session?.user?.id,
          full_name: values.name,
          age: parseInt(values.age),
          location: values.location,
          travel_style: values.travelStyle,
          bio: values.bio,
          interests: values.interests.split(",").map((item) => item.trim()),
          languages: values.languages.split(",").map((item) => item.trim()),
          preferred_destinations: values.preferredDestinations
            .split(",")
            .map((item) => item.trim()),
          gender: values.gender,
          preferred_gender: values.preferredGender
            .split(",")
            .map((item) => item.trim()),
          profile_image_url: values.profileImage,
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      onProfileUpdate();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  return { form, onSubmit };
};