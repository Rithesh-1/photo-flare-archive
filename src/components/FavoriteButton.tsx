
import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePhotos } from '@/context/PhotoContext';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const FavoriteButton = () => {
  const location = useLocation();
  const { toggleFavorite, isFavorite, photos } = usePhotos();
  
  // Hide button on photo detail page
  if (location.pathname.includes('/photo/')) {
    return null;
  }
  
  // Get current path
  const currentPath = location.pathname;
  const isHomePage = currentPath === '/';
  const isFavoritesPage = currentPath === '/favorites';
  
  // Only show the global favorite button on main page and not on favorites route
  if (!isHomePage || isFavoritesPage) {
    return null;
  }

  const handleFavoriteAll = () => {
    // Get the first non-favorited photo to add to favorites
    const nonFavoritedPhoto = photos.find(photo => !isFavorite(photo.id));
    
    if (nonFavoritedPhoto) {
      toggleFavorite(nonFavoritedPhoto.id);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <button
        onClick={handleFavoriteAll}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-white hover:bg-red-50 transition-colors"
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Heart 
            size={28} 
            className="text-photo-600 hover:text-red-500 transition-colors duration-300"
          />
        </motion.div>
      </button>
    </motion.div>
  );
};

export default FavoriteButton;
