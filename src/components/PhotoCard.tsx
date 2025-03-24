
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  id: string;
  url: string;
  title: string;
  aspectRatio?: number;
}

const PhotoCard = ({ id, url, title, aspectRatio = 3/2 }: PhotoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden photo-card-shadow photo-card-hover"
    >
      <Link to={`/photo/${id}`} className="block relative">
        <div 
          className={cn(
            "relative w-full overflow-hidden",
            !isLoaded && "bg-photo-200 loading-shimmer"
          )}
          style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
        >
          {!isError ? (
            <img
              src={`${url}?w=600&q=80`}
              alt={title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-photo-200 text-photo-500">
              Unable to load image
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default PhotoCard;
