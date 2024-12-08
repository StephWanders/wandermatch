import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../ProfileSchema";

interface AboutYouSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const AboutYouSection = ({ form }: AboutYouSectionProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
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
  );
};

export default AboutYouSection;