import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { profileFormSchema, type ProfileFormValues } from "./ProfileSchema";
import { supabase } from "@/integrations/supabase/client";
import BasicInfoSection from "./sections/BasicInfoSection";
import TravelPreferencesSection from "./sections/TravelPreferencesSection";
import AboutYouSection from "./sections/AboutYouSection";

interface ProfileFormProps {
  session: any;
  profile: any;
  onProfileUpdate: () => void;
}

const ProfileForm = ({ session, profile, onProfileUpdate }: ProfileFormProps) => {
  const navigate = useNavigate();
  
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
      navigate("/");
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
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      const toastId = toast.error("Error updating profile");
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2000);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <TravelPreferencesSection form={form} />
        <AboutYouSection form={form} />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            {profile ? 'Update Profile' : 'Create Profile'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;