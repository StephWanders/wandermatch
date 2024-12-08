import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  isDefault: boolean;
  onDelete: () => void;
  onSetDefault: () => void;
}

const ImagePreview = ({ imageUrl, isDefault, onDelete, onSetDefault }: ImagePreviewProps) => {
  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={imageUrl} alt="Profile" />
        <AvatarFallback className="bg-blue-100">
          <Camera className="h-8 w-8 text-blue-500" />
        </AvatarFallback>
      </Avatar>
      <div className="absolute -top-2 -right-2 flex gap-1">
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {!isDefault && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs"
          onClick={onSetDefault}
        >
          Set Default
        </Button>
      )}
    </div>
  );
};

export default ImagePreview;