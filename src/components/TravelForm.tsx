import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Minus } from "lucide-react";

interface Child {
  id: number;
  age: string;
}

const TravelForm = ({ onSearch }: { onSearch: (data: any) => void }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState<Child[]>([]);

  const addChild = () => {
    const newChild = {
      id: children.length + 1,
      age: "",
    };
    setChildren([...children, newChild]);
  };

  const removeChild = (id: number) => {
    setChildren(children.filter(child => child.id !== id));
  };

  const updateChildAge = (id: number, age: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, age } : child
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      startDate,
      endDate,
      location,
      travelers: {
        adults: parseInt(adults),
        children: children.map(child => ({
          age: parseInt(child.age)
        }))
      }
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adults">Number of Adults</Label>
          <Input
            id="adults"
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Children</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addChild}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Child
            </Button>
          </div>
          
          {children.map((child) => (
            <div key={child.id} className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                max="17"
                placeholder="Age"
                value={child.age}
                onChange={(e) => updateChildAge(child.id, e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button"
                variant="outline" 
                size="icon"
                onClick={() => removeChild(child.id)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Search
      </Button>
    </form>
  );
};

export default TravelForm;