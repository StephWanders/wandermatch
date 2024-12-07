import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
    message: "You must be at least 18 years old",
  }),
  travelStyle: z.string({
    required_error: "Please select your preferred travel style",
  }),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  interests: z.string().min(5, "Please list some of your interests"),
  languages: z.string().min(2, "Please list languages you speak"),
  preferredDestinations: z.string().min(2, "Please list some destinations"),
  profileImage: z.string().optional(),
});

const CreateProfile = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: "",
      travelStyle: "",
      bio: "",
      interests: "",
      languages: "",
      preferredDestinations: "",
      profileImage: "",
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values);
    toast.success("Profile created successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6 md:p-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Create Your Travel Profile</h1>
          <p className="text-muted-foreground">
            Tell us about yourself to find your perfect travel companion
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-blue-100">
                <Camera className="h-8 w-8 text-blue-500" />
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Create Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfile;