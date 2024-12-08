import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEventIcon } from "@/utils/eventUtils";

interface EventCardProps {
  event: {
    title: string;
    type: string;
    time: string;
    location: string;
    price: string;
    description: string;
    tags: string[];
    icon?: React.ReactNode;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const icon = event.icon || getEventIcon(event.type);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {icon}
        <h3 className="text-lg font-semibold line-clamp-1">{event.title}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{event.time}</p>
          <p className="text-sm text-gray-600">{event.location}</p>
          <p className="text-sm font-semibold text-blue-600">{event.price}</p>
          <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
          <div className="flex flex-wrap gap-1 pt-2">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;