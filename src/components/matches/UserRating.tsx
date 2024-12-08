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
  const { data: ratings } = useQuery({
    queryKey: ['user-ratings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_ratings', { user_id: userId });
      
      if (error) throw error;
      return data;
    }
  });

  if (!ratings?.length) return null;

  const overallRating = ratings.find(r => r.category === 'overall_safety');
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1 text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-medium">
            {overallRating?.average_rating || "N/A"}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {ratings.map((rating) => (
              <div key={rating.category} className="flex justify-between gap-4 text-sm">
                <span className="capitalize">{rating.category.replace(/_/g, ' ')}</span>
                <span className="font-medium">{rating.average_rating} ({rating.total_ratings})</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserRating;