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
});

const CreateProfile = () => {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: "",
      travelStyle: "",
      bio: "",
      interests: "",
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values);
    toast.success("Profile created successfully!");
    // Here we would typically save the profile data to a backend
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create Your Travel Profile</h1>
          <p className="text-muted-foreground">
            Tell us about yourself to find your perfect travel companion
          </p>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself and your travel experiences..."
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
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you enjoy? (e.g., hiking, photography, local cuisine)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfile;