import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { profileFormSchema, type ProfileFormValues } from "./ProfileSchema";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to update your profile");
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
      toast.success("Profile updated successfully!");
      onProfileUpdate();
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredGender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Gender for Matching</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., male, female, any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Travel Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="travelStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your travel style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="backpacker">Backpacker</SelectItem>
                      <SelectItem value="luxury">Luxury Traveler</SelectItem>
                      <SelectItem value="adventure">Adventure Seeker</SelectItem>
                      <SelectItem value="cultural">Cultural Explorer</SelectItem>
                      <SelectItem value="relaxation">Relaxation Enthusiast</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages Spoken</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., English, Spanish, French" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredDestinations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Destinations</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Japan, Italy, Brazil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself and your travel experiences..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you enjoy while traveling? (e.g., hiking, photography, local cuisine)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          {profile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;