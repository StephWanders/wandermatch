import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface UploadButtonProps {
  uploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton = ({ uploading, onFileSelect }: UploadButtonProps) => {
  return (
    <div className="relative">
      <label htmlFor="imageUpload" className="cursor-pointer block">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-blue-100">
            <Camera className="h-8 w-8 text-blue-500" />
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full"
          disabled={uploading}
          type="button"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </label>
      <input
        type="file"
        id="imageUpload"
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
        disabled={uploading}
      />
    </div>
  );
};

export default UploadButton;