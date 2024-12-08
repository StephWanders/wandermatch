import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RatingFormProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  ratedUserId: string;
}

const RATING_CATEGORIES = [
  { id: 'punctuality', label: 'Punctuality' },
  { id: 'communication', label: 'Communication' },
  { id: 'respectfulness', label: 'Respectfulness' },
  { id: 'responsibility', label: 'Responsibility' },
  { id: 'overall_safety', label: 'Overall Experience' },
];

const RatingForm = ({ isOpen, onClose, matchId, ratedUserId }: RatingFormProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [review, setReview] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit a rating for each category
      for (const category of RATING_CATEGORIES) {
        const rating = ratings[category.id];
        if (!rating) continue;

        const { error } = await supabase
          .from('trip_ratings')
          .insert({
            match_id: matchId,
            rated_user_id: ratedUserId,
            category: category.id,
            rating,
            review_text: category.id === 'overall_safety' ? review : null,
            is_anonymous: isAnonymous,
          });

        if (error) throw error;
      }

      toast.success("Rating submitted successfully");
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Travel Partner</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {RATING_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-2">
              <Label>{category.label}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(category.id, value)}
                    className={`p-1 hover:text-yellow-500 ${
                      ratings[category.id] >= value ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label>Review (Optional)</Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              className="h-24"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Post Anonymously</Label>
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(ratings).length === 0}
            className="w-full"
          >
            Submit Rating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingForm;