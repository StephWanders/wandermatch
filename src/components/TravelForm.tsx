import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const TravelForm = ({ onSearch }: { onSearch: (data: any) => void }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [travelers, setTravelers] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      startDate,
      endDate,
      location,
      travelers: parseInt(travelers)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full animate-slide-up">
      <div className="space-y-2">
        <Label htmlFor="location">Where do you want to go?</Label>
        <Input
          id="location"
          placeholder="Enter destination"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="travelers">Number of Travelers</Label>
        <Input
          id="travelers"
          type="number"
          min="1"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Search
      </Button>
    </form>
  );
};

export default TravelForm;