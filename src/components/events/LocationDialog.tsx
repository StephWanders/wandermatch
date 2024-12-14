import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manualLocation: string;
  setManualLocation: (location: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  onGPSRetry: () => void;
}

const LocationDialog = ({
  open,
  onOpenChange,
  manualLocation,
  setManualLocation,
  onSubmit,
  error,
  onGPSRetry,
}: LocationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
          <DialogDescription>
            Enter your city name to see local events
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 mb-4">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Enter city name"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit">Set Location</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onGPSRetry();
              }}
            >
              Try GPS Again
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;