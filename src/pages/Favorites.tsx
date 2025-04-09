
import React, { useState } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import PhotoCard from '@/components/PhotoCard';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeft } from 'lucide-react';
import { Photo } from '@/types/photo';
import FullscreenImageViewer from '@/components/FullscreenImageViewer';

const Favorites = () => {
  const { photos, favorites, loading, isFavorite } = usePhotos();
  const favoritePhotos = photos.filter(photo => favorites.includes(photo.id));
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Convert photos to the expected Photo type format for fullscreen viewer
  const convertedPhotos: Photo[] = favoritePhotos.map(photo => ({
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

  const handleOpenFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenIndex(null);
  };

  const handleNavigateFullscreen = (newIndex: number) => {
    setFullscreenIndex(newIndex);
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mr-2"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold mb-6 text-photo-800">Your Favorites</h1>
      
      {/* If no favorites, display empty state */}
      {favoritePhotos.length === 0 && !loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center px-4"
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
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-photo-800 mb-2">No favorites yet</h3>
          <p className="text-photo-500 max-w-md mb-6">
            Click the heart icon on any photo to add it to your favorites.
          </p>
          <Button asChild>
            <Link to="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritePhotos.map((photo, index) => (
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
      )}

      {/* Fullscreen image viewer */}
      <FullscreenImageViewer
        photos={convertedPhotos}
        currentIndex={fullscreenIndex !== null ? fullscreenIndex : 0}
        isOpen={fullscreenIndex !== null}
        onClose={handleCloseFullscreen}
        onNavigate={handleNavigateFullscreen}
      />
    </div>
  );
};

export default Favorites;
