
import React from 'react';
import { usePhotos } from '@/context/PhotoContext';
import PhotoCard from '@/components/PhotoCard';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const Favorites = () => {
  const { photos, favorites, loading } = usePhotos();
  const favoritePhotos = photos.filter(photo => favorites.includes(photo.id));

  // If no favorites, display empty state
  if (favoritePhotos.length === 0 && !loading) {
    return (
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
    );
  }

  // Display the favorites grid
  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-photo-800">Your Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoritePhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            id={photo.id}
            url={photo.url}
            title={photo.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
