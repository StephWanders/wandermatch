import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { ProfileFormValues } from "./ProfileSchema";
import AboutYouSection from "./sections/AboutYouSection";
import BasicInfoSection from "./sections/BasicInfoSection";
import TravelPreferencesSection from "./sections/TravelPreferencesSection";
import { useProfileForm } from "./hooks/useProfileForm";
import { useProfilePictures } from "./hooks/useProfilePictures";

interface ProfileFormProps {
  session: any;
  profile: any;
  onProfileUpdate: () => void;
}

const ProfileForm = ({ session, profile, onProfileUpdate }: ProfileFormProps) => {
  const navigate = useNavigate();
  const { profilePictures, handleImagesUpdate } = useProfilePictures(session?.user?.id);
  const { form, onSubmit } = useProfileForm(profile, session, onProfileUpdate);

  const handleFormSubmit = async (values: ProfileFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <BasicInfoSection 
          form={form} 
          userId={session?.user?.id}
          profilePictures={profilePictures}
          onImagesUpdate={handleImagesUpdate}
        />
        
        <AboutYouSection form={form} />
        
        <TravelPreferencesSection form={form} />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            {profile ? 'Update Profile' : 'Create Profile'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;