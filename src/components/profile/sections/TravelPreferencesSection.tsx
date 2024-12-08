import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../ProfileSchema";

interface TravelPreferencesSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const TravelPreferencesSection = ({ form }: TravelPreferencesSectionProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
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
  );
};

export default TravelPreferencesSection;