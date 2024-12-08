import { ImageUploadContext } from "./image-upload/ImageUploadContext";
import { useImageUploadState } from "./image-upload/useImageUploadState";
import ImagePreview from "./image-upload/ImagePreview";
import UploadButton from "./image-upload/UploadButton";

interface ProfilePicture {
  id?: string;
  image_url: string;
  is_default: boolean;
}

interface ProfileImageUploadProps {
  userId?: string;
  existingImages?: ProfilePicture[];
  onImagesUpdate?: (images: ProfilePicture[]) => void;
}

const ProfileImageUpload = ({ 
  userId, 
  existingImages = [], 
  onImagesUpdate 
}: ProfileImageUploadProps) => {
  const {
    images,
    uploading,
    handleFileUpload,
    handleSetDefault,
    handleDelete
  } = useImageUploadState(userId, existingImages, onImagesUpdate);

  return (
    <ImageUploadContext.Provider 
      value={{
        images,
        uploading,
        handleFileUpload,
        handleSetDefault,
        handleDelete
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {images.map((image) => (
            <ImagePreview
              key={image.id}
              imageUrl={image.image_url}
              isDefault={image.is_default}
              onDelete={() => handleDelete(image.id!)}
              onSetDefault={() => handleSetDefault(image.id!)}
            />
          ))}
          <UploadButton 
            uploading={uploading}
            onFileSelect={handleFileUpload}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Upload profile pictures. The first image will be set as default automatically.
          Maximum file size: 5MB.
        </p>
      </div>
    </ImageUploadContext.Provider>
  );
};

export default ProfileImageUpload;