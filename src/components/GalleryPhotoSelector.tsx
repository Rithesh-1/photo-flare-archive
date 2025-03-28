
import React, { useState } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GalleryPhotoSelectorProps {
  selectedPhotoIds: string[];
  onSelectPhoto: (photoId: string) => void;
  initialPhotoId?: string;
}

const GalleryPhotoSelector = ({ 
  selectedPhotoIds, 
  onSelectPhoto, 
  initialPhotoId 
}: GalleryPhotoSelectorProps) => {
  const { photos } = usePhotos();
  
  // If there's an initialPhotoId provided, ensure it's selected
  React.useEffect(() => {
    if (initialPhotoId && !selectedPhotoIds.includes(initialPhotoId)) {
      onSelectPhoto(initialPhotoId);
    }
  }, [initialPhotoId, onSelectPhoto, selectedPhotoIds]);
  
  if (photos.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No photos available to select. Upload some photos first.
      </div>
    );
  }

  return (
    <ScrollArea className="h-60 border rounded-md p-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map(photo => (
          <div 
            key={photo.id}
            className={cn(
              "relative aspect-square rounded-md overflow-hidden cursor-pointer border-2",
              selectedPhotoIds.includes(photo.id) 
                ? "border-primary" 
                : "border-transparent hover:border-gray-300"
            )}
            onClick={() => onSelectPhoto(photo.id)}
          >
            <img 
              src={photo.url} 
              alt={photo.title}
              className="object-cover w-full h-full"
            />
            {selectedPhotoIds.includes(photo.id) && (
              <div className="absolute top-1 right-1">
                <CheckCircle className="h-5 w-5 text-primary fill-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default GalleryPhotoSelector;
