import * as z from "zod";

export const profileFormSchema = z.object({
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

export type ProfileFormValues = z.infer<typeof profileFormSchema>;