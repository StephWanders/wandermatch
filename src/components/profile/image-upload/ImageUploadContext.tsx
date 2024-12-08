import { createContext, useContext } from 'react';

interface ProfilePicture {
  id?: string;
  image_url: string;
  is_default: boolean;
}

interface ImageUploadContextType {
  images: ProfilePicture[];
  uploading: boolean;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSetDefault: (imageId: string) => Promise<void>;
  handleDelete: (imageId: string) => Promise<void>;
}

export const ImageUploadContext = createContext<ImageUploadContextType | undefined>(undefined);

export const useImageUpload = () => {
  const context = useContext(ImageUploadContext);
  if (!context) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider');
  }
  return context;
};