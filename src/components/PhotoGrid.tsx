
import React, { useState } from 'react';
import PhotoCard from './PhotoCard';
import { usePhotos } from '@/context/PhotoContext';
import { useDatabase } from '@/context/DatabaseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UploadCloud, RefreshCw, Database, Cloud } from 'lucide-react';
import { toast } from 'sonner';
import { Photo } from '@/types/photo';
import FullscreenImageViewer from './FullscreenImageViewer';

const PhotoGrid = () => {
  const { photos, loading, uploadPhoto, isFavorite } = usePhotos();
  const { mode, isOffline, syncStatus, pendingChanges } = useDatabase();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Convert photos to the expected Photo type format for fullscreen viewer
  const convertedPhotos: Photo[] = photos.map(photo => ({
    id: photo.id,
    url: photo.url,
    title: photo.title,
    description: photo.description || '',
    date: photo.createdAt.toISOString(),
    tags: photo.classification?.tags || [],
    albumIds: photo.albumId ? [photo.albumId] : [],
    isFavorite: isFavorite(photo.id),
    originalUrl: photo.originalUrl,
    thumbnailUrl: photo.url,
    classification: photo.classification
  }));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    try {
      await uploadPhoto(file);
      // Reset input value to allow uploading the same file again
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image');
      event.target.value = '';
    }
  };

  const handleOpenFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenIndex(null);
  };

  const handleNavigateFullscreen = (newIndex: number) => {
    setFullscreenIndex(newIndex);
  };

  // Display loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-xl overflow-hidden">
            <Skeleton className="w-full h-48" />
          </div>
        ))}
      </div>
    );
  }

  // If no photos, display empty state with upload button
  if (photos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-photo-100 flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-8 h-8 text-photo-400"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-photo-800 mb-2">No photos yet</h3>
        <p className="text-photo-500 max-w-md mb-6">
          Upload your first photo to get started. Your photos will appear here.
          {isOffline && mode === 'cloud' && (
            <span className="block mt-2 text-amber-500">
              You're currently offline. Photos will be saved locally and synced when you reconnect.
            </span>
          )}
        </p>
        <Button className="flex items-center gap-2" variant="outline">
          <UploadCloud className="w-4 h-4" />
          <label htmlFor="file-upload" className="cursor-pointer">
            Upload a photo
          </label>
          <input 
            id="file-upload" 
            type="file" 
            accept="image/*"
            className="hidden" 
            onChange={handleFileUpload}
          />
        </Button>
      </motion.div>
    );
  }

  // Display the photo grid with storage mode indicator
  return (
    <>
      {/* Status bar for storage mode and sync status */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm">
          <div className={`rounded-full h-2 w-2 ${isOffline ? 'bg-amber-500' : 'bg-green-500'}`}></div>
          <span className="flex items-center gap-1.5">
            {mode === 'local' ? (
              <>
                <Database className="h-4 w-4" />
                <span>Local Storage</span>
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4" />
                <span>Cloud Storage {isOffline ? '(Offline)' : ''}</span>
              </>
            )}
          </span>
        </div>
        
        {syncStatus === 'pending' && (
          <div className="flex items-center gap-2 text-amber-500 text-sm">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>{pendingChanges} changes pending sync</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            id={photo.id}
            url={photo.url}
            title={photo.title}
            classification={photo.classification}
            onFullscreen={() => handleOpenFullscreen(index)}
          />
        ))}
      </div>

      {/* Fullscreen image viewer */}
      <FullscreenImageViewer
        photos={convertedPhotos}
        currentIndex={fullscreenIndex !== null ? fullscreenIndex : 0}
        isOpen={fullscreenIndex !== null}
        onClose={handleCloseFullscreen}
        onNavigate={handleNavigateFullscreen}
      />
    </>
  );
};

export default PhotoGrid;
