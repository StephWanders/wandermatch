import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type RatingCategory = Database['public']['Enums']['rating_category'];

interface RatingFormProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  ratedUserId: string;
}

const RATING_CATEGORIES: { id: RatingCategory; label: string; description: string }[] = [
  { id: 'punctuality', label: 'Punctuality', description: 'How reliable were they in meeting planned schedules?' },
  { id: 'communication', label: 'Communication', description: 'How clear and responsive were they in discussions?' },
  { id: 'respectfulness', label: 'Respect for Boundaries', description: 'Did they respect personal and cultural boundaries?' },
  { id: 'responsibility', label: 'Responsibility', description: 'How responsible were they throughout the trip?' },
  { id: 'trustworthiness', label: 'Trustworthiness', description: 'Could you trust them with belongings and information?' },
  { id: 'conflict_management', label: 'Conflict Management', description: 'How well did they handle disagreements?' },
  { id: 'preparedness', label: 'Preparedness', description: 'Were they adequately prepared for the trip?' },
  { id: 'overall_safety', label: 'Overall Safety', description: 'How safe did you feel traveling with them?' },
];

const initialRatings: Record<RatingCategory, number> = {
  punctuality: 0,
  communication: 0,
  respectfulness: 0,
  responsibility: 0,
  trustworthiness: 0,
  conflict_management: 0,
  preparedness: 0,
  overall_safety: 0,
};

const RatingForm = ({ isOpen, onClose, matchId, ratedUserId }: RatingFormProps) => {
  const [ratings, setRatings] = useState<Record<RatingCategory, number>>(initialRatings);
  const [review, setReview] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUserId(session.user.id);
      }
    });
  }, []);

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    if (!currentUserId) {
      toast.error("You must be logged in to submit ratings");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting ratings:', ratings);
      
      // Submit a rating for each category
      for (const category of RATING_CATEGORIES) {
        const rating = ratings[category.id];
        if (!rating) continue;

        const { error } = await supabase
          .from('trip_ratings')
          .insert({
            match_id: matchId,
            rated_user_id: ratedUserId,
            rater_id: currentUserId,
            category: category.id,
            rating,
            review_text: category.id === 'overall_safety' ? review : null,
            is_anonymous: isAnonymous,
          });

        if (error) {
          console.error('Error submitting rating:', error);
          throw error;
        }
      }

      toast.success("Rating submitted successfully");
      onClose();
      // Refresh the page to show the new rating
      window.location.reload();
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
              <p className="text-sm text-gray-500">{category.description}</p>
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
            disabled={isSubmitting || Object.values(ratings).every(r => r === 0)}
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