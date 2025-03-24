import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Trash2, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePhotos } from '@/context/PhotoContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photos, deletePhoto } = usePhotos();
  const [photo, setPhoto] = useState(photos.find(p => p.id === id) || null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Find the photo from the context
    const foundPhoto = photos.find(p => p.id === id);
    setPhoto(foundPhoto || null);

    // If photo not found, navigate back
    if (!foundPhoto) {
      toast("Photo not found", {
        description: "The photo you're looking for doesn't exist.",
      });
      navigate('/');
    }
  }, [id, photos, navigate]);

  if (!photo) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Photo not found</h2>
          <p className="text-photo-500 mb-4">The photo you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  const handleGoBack = () => {
    navigate('/');
  };

  const handleDelete = () => {
    deletePhoto(photo.id);
    navigate('/');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Download started", {
      description: "Your photo is being downloaded."
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied", {
        description: "Photo link copied to clipboard."
      });
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast(isLiked ? "Removed from favorites" : "Added to favorites", {
      description: isLiked 
        ? "Photo has been removed from your favorites" 
        : "Photo has been added to your favorites"
    });
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden z-50">
      <AnimatePresence>
        <motion.div
          key={photo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <div className="glass-effect py-3 px-4 flex items-center justify-between z-10">
            <Button variant="ghost" size="icon" onClick={handleGoBack}>
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleLike}>
                <Heart 
                  size={20} 
                  className={cn(
                    "transition-colors duration-300",
                    isLiked ? "fill-red-500 text-red-500" : "text-photo-600"
                  )} 
                />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 size={20} className="text-photo-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload}>
                <Download size={20} className="text-photo-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 size={20} className="text-photo-600" />
              </Button>
            </div>
          </div>
          
          {/* Photo container */}
          <div className="flex-1 overflow-hidden bg-photo-900/5">
            <div className="h-full flex items-center justify-center p-4">
              <div className="relative max-w-5xl max-h-full">
                {!isLoaded && (
                  <div className="absolute inset-0 bg-photo-200 animate-pulse rounded-lg"></div>
                )}
                <motion.img
                  src={photo.url}
                  alt={photo.title}
                  className={cn(
                    "max-w-full max-h-full object-contain rounded-lg shadow-2xl",
                    isLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setIsLoaded(true)}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
          
          {/* Footer with info */}
          <div className="glass-effect py-4 px-6">
            <div className="flex flex-col">
              <h1 className="text-xl font-medium text-photo-800">{photo.title}</h1>
              {photo.description && (
                <p className="text-sm text-photo-600 mt-1">{photo.description}</p>
              )}
              <p className="text-xs text-photo-500 mt-2">
                {format(new Date(photo.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PhotoDetail;
