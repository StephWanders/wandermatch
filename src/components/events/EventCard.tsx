import { Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEventIcon } from "@/utils/eventUtils";

interface EventCardProps {
  event: {
    title: string;
    type: string;
    description: string;
    tags: string[];
    time: string;
    price: string;
    location: string;
    url?: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {getEventIcon(event.type)}
          <span className="text-sm font-medium text-gray-600">{event.type}</span>
        </div>
        <CardTitle className="text-lg">{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{event.description}</p>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{event.time}</span>
            <span className="text-primary">{event.price}</span>
          </div>
          <p className="text-sm text-gray-500">{event.location}</p>
          {event.url && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => window.open(event.url, '_blank')}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Get Tickets
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;