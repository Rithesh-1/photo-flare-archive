
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tag, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PhotoCardProps {
  id: string;
  url: string;
  title: string;
  aspectRatio?: number;
  classification?: {
    tags: string[];
    faces: number;
    quality: { score: number; issue?: string };
  };
}

const PhotoCard = ({ id, url, title, aspectRatio = 3/2, classification }: PhotoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const displayTags = classification?.tags?.slice(0, 3) || [];
  const hasClassification = classification && displayTags.length > 0;

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsError(false);
    setIsLoaded(false);
    setRetryCount(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden photo-card-shadow photo-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/photo/${id}`} className="block relative">
        <div 
          className={cn(
            "relative w-full overflow-hidden",
            !isLoaded && !isError && "bg-photo-200 loading-shimmer"
          )}
          style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
        >
          {!isError ? (
            <img
              src={`${url}${url.includes('?') ? '&' : '?'}t=${retryCount}`}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-photo-200 text-photo-500">
              <AlertCircle className="w-8 h-8 mb-2 text-photo-500" />
              <p className="text-sm mb-2">Unable to load image</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRetry}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}
          
          {/* Classification tags overlay */}
          {hasClassification && isLoaded && (
            <div 
              className={cn(
                "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent",
                "transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex flex-wrap gap-1">
                {displayTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-black/40 text-white border-none text-xs backdrop-blur-sm"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                
                {classification?.faces > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/70 text-white border-none text-xs backdrop-blur-sm"
                  >
                    {classification.faces} Face{classification.faces > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default PhotoCard;
