import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session, profile }: WelcomeSectionProps) => {
  const { data: newMatches } = useQuery({
    queryKey: ['new-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('matches')
        .select('*, profiles!matches_profile2_id_fkey(*)')
        .eq('profile1_id', session.user.id)
        .eq('status', 'pending')
        .order('matched_at', { ascending: false });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('messages')
        .select('*, profiles!messages_sender_id_fkey(*)')
        .eq('receiver_id', session.user.id)
        .is('read_at', null)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in">
        <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
          <Link to="/matches">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">New Matches</h3>
                <p className="text-sm text-gray-600">
                  {newMatches?.length || 0} new potential matches
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
          <Link to="/chat">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Recent Messages</h3>
                <p className="text-sm text-gray-600">
                  {recentMessages?.length || 0} unread messages
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
          <Link to="/notifications">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Activity</h3>
                <p className="text-sm text-gray-600">
                  Check your travel updates
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeSection;