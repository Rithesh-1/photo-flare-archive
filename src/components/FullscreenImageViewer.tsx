
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Photo } from '@/types/photo';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FullscreenImageViewerProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showQualityInfo, setShowQualityInfo] = useState(false);
  
  const currentPhoto = photos[currentIndex];
  
  useEffect(() => {
    // Reset zoom level when changing photos
    setZoom(1);
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
          setZoom(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          setZoom(prev => Math.max(prev - 0.25, 0.5));
          break;
        case '0':
          setZoom(1);
          break;
        case 'q':
          setShowQualityInfo(prev => !prev);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos, onClose]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const toggleQualityInfo = () => {
    setShowQualityInfo(prev => !prev);
  };
  
  if (!isOpen || !currentPhoto) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleQualityInfo}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <span className="text-sm">
                {currentIndex + 1} / {photos.length}
              </span>
              {currentPhoto.title && (
                <span className="ml-4 text-white/90">{currentPhoto.title}</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Main image area */}
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onClick={onClose}
          >
            <div 
              className="relative max-w-full max-h-full transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentPhoto.originalUrl || currentPhoto.url}
                alt={currentPhoto.title}
                className="max-h-screen max-w-screen object-contain"
              />
              
              {/* Quality overlay */}
              {showQualityInfo && currentPhoto.classification && (
                <div className="absolute top-2 right-2 bg-black/80 text-white p-3 rounded-md text-sm max-w-xs">
                  <h4 className="font-medium mb-2">Image Quality</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Quality Score:</span>
                        <span className={cn(
                          currentPhoto.classification.quality.score > 80 ? "text-green-400" :
                          currentPhoto.classification.quality.score > 50 ? "text-yellow-400" : 
                          "text-red-400"
                        )}>
                          {currentPhoto.classification.quality.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={cn(
                            "h-1.5 rounded-full",
                            currentPhoto.classification.quality.score > 80 ? "bg-green-400" :
                            currentPhoto.classification.quality.score > 50 ? "bg-yellow-400" : 
                            "bg-red-400"
                          )}
                          style={{ width: `${currentPhoto.classification.quality.score}%` }}
                        />
                      </div>
                    </div>
                    
                    {currentPhoto.classification.quality.issue && (
                      <div>
                        <span className="font-medium">Issues:</span>
                        <span className="text-red-300 ml-2">
                          {currentPhoto.classification.quality.issue}
                        </span>
                      </div>
                    )}
                    
                    {currentPhoto.classification.faces > 0 && (
                      <div>
                        <span className="font-medium">Faces:</span>
                        <span className="ml-2">
                          {currentPhoto.classification.faces} detected
                        </span>
                      </div>
                    )}
                    
                    {currentPhoto.classification.tags && currentPhoto.classification.tags.length > 0 && (
                      <div>
                        <span className="font-medium">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentPhoto.classification.tags.map((tag, i) => (
                            <span key={i} className="bg-white/20 text-xs px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white z-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="text-sm w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white rounded-full bg-black/40 hover:bg-black/60 h-12 w-12"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white rounded-full bg-black/40 hover:bg-black/60 h-12 w-12"
            onClick={handleNext}
            disabled={currentIndex === photos.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenImageViewer;
