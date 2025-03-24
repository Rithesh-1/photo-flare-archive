
import React from 'react';
import PhotoCard from './PhotoCard';
import { usePhotos } from '@/context/PhotoContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const PhotoGrid = () => {
  const { photos, loading } = usePhotos();

  // Display loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="rounded-xl overflow-hidden">
            <Skeleton className="w-full h-48" />
          </div>
        ))}
      </div>
    );
  }

  // If no photos, display empty state
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
        <p className="text-photo-500 max-w-md">
          Upload your first photo to get started. Your photos will appear here.
        </p>
      </motion.div>
    );
  }

  // Display the photo grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          id={photo.id}
          url={photo.url}
          title={photo.title}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
