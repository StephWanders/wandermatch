import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormValues } from "../ProfileSchema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileForm = (profile: any, session: any, onProfileUpdate: () => void) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.full_name || "",
      age: profile?.age?.toString() || "",
      location: profile?.location || "",
      travelStyle: profile?.travel_style || "",
      bio: profile?.bio || "",
      interests: profile?.interests?.join(", ") || "",
      languages: profile?.languages?.join(", ") || "",
      preferredDestinations: profile?.preferred_destinations?.join(", ") || "",
      gender: profile?.gender || "",
      preferredGender: profile?.preferred_gender?.join(", ") || "",
    },
  });

  const hasChanges = (values: ProfileFormValues) => {
    const currentValues = {
      full_name: values.name,
      age: parseInt(values.age),
      location: values.location,
      travel_style: values.travelStyle,
      bio: values.bio,
      interests: values.interests.split(",").map(i => i.trim()),
      languages: values.languages.split(",").map(l => l.trim()),
      preferred_destinations: values.preferredDestinations.split(",").map(d => d.trim()),
      gender: values.gender,
      preferred_gender: values.preferredGender.split(",").map(g => g.trim()),
    };

    return Object.keys(currentValues).some(key => {
      const currentValue = currentValues[key as keyof typeof currentValues];
      const profileValue = profile[key];

      if (Array.isArray(currentValue) && Array.isArray(profileValue)) {
        return JSON.stringify(currentValue) !== JSON.stringify(profileValue);
      }
      return currentValue !== profileValue;
    });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    if (!hasChanges(values)) {
      toast.info("No changes detected");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.name,
          age: parseInt(values.age),
          location: values.location,
          travel_style: values.travelStyle,
          bio: values.bio,
          interests: values.interests.split(",").map(i => i.trim()),
          languages: values.languages.split(",").map(l => l.trim()),
          preferred_destinations: values.preferredDestinations.split(",").map(d => d.trim()),
          gender: values.gender,
          preferred_gender: values.preferredGender.split(",").map(g => g.trim()),
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;
      
      const toastId = toast.success("Profile updated successfully!");
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
      
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      const toastId = toast.error("Error updating profile");
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
    }
  };

  return {
    form,
    onSubmit,
    hasChanges
  };
};