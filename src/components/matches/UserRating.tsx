import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserRatingProps {
  userId: string;
}

const UserRating = ({ userId }: UserRatingProps) => {
  const { data: ratings, isLoading } = useQuery({
    queryKey: ['user-ratings', userId],
    queryFn: async () => {
      console.log('Fetching ratings for user:', userId);
      const { data, error } = await supabase
        .rpc('get_user_ratings', { user_id: userId });
      
      if (error) {
        console.error('Error fetching ratings:', error);
        throw error;
      }
      console.log('Received ratings:', data);
      return data;
    }
  });

  if (isLoading) return null;
  if (!ratings?.length) return null;

  const overallRating = ratings.find(r => r.category === 'overall_safety');
  if (!overallRating) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-medium">
            {overallRating.average_rating}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-sm">
              <span>Overall Safety Rating</span>
              <span className="font-medium">
                {overallRating.average_rating} ({overallRating.total_ratings})
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserRating;