import EventCard from "./EventCard";

interface EventsGridProps {
  events: any[];
}

const EventsGrid = ({ events }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventsGrid;