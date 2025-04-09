
import React, { useState, useMemo } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { useDatabase } from '@/context/DatabaseContext';
import { Photo } from '@/types/photo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar, Database, Image, Maximize } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import FullscreenImageViewer from './FullscreenImageViewer';

interface OrganizedPhotoViewerProps {
  className?: string;
}

const OrganizedPhotoViewer: React.FC<OrganizedPhotoViewerProps> = ({ className }) => {
  const { photos, loading } = usePhotos();
  const { mode, isOffline, syncStatus, pendingChanges } = useDatabase();
  const [viewMode, setViewMode] = useState<'grid' | 'date'>('grid');
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Convert context photos to the expected Photo type format
  const convertedPhotos = useMemo(() => {
    return photos.map(photo => ({
      id: photo.id,
      url: photo.url,
      originalUrl: photo.originalUrl,
      title: photo.title,
      description: photo.description,
      dateAdded: photo.createdAt.toISOString(), // Convert Date to ISO string
      isFavorite: false, // Set default value
      thumbnailUrl: photo.url,
      tags: photo.classification?.tags,
      classification: photo.classification
    })) as Photo[];
  }, [photos]);

  // Group photos by date
  const photosByDate = useMemo(() => {
    const groups: { [key: string]: Photo[] } = {};
    
    convertedPhotos.forEach(photo => {
      const date = new Date(photo.dateAdded);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(photo);
    });
    
    // Sort dates in descending order (newest first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, photos]) => ({
        date,
        formattedDate: format(new Date(date), 'MMMM d, yyyy'),
        photos
      }));
  }, [convertedPhotos]);

  const handleOpenFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenIndex(null);
  };

  const handleNavigateFullscreen = (newIndex: number) => {
    setFullscreenIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <p className="text-photo-500">Loading photos...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <Tabs defaultValue="grid" className="w-full" onValueChange={(value) => setViewMode(value as 'grid' | 'date')}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Grid View</span>
              </TabsTrigger>
              <TabsTrigger value="date" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Date View</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-md">
              <div className={`rounded-full h-2 w-2 ${isOffline ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              <span className="flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                <span>{mode === 'local' ? 'Local Storage' : 'Cloud Storage'}</span>
              </span>
              {syncStatus === 'pending' && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-none">
                  {pendingChanges} pending
                </Badge>
              )}
            </div>
          </div>

          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
              {convertedPhotos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <AspectRatio ratio={1} className="bg-muted">
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      className="object-cover w-full h-full cursor-pointer" 
                      loading="lazy"
                      onClick={() => handleOpenFullscreen(index)}
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 flex items-start justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/30 text-white hover:bg-black/50 rounded-full h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFullscreen(index);
                      }}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="absolute left-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white hover:bg-black/50 h-7"
                  >
                    <Link to={`/photo/${photo.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="date" className="mt-0">
            <ScrollArea className="h-[calc(100vh-230px)]">
              {photosByDate.length > 0 ? (
                photosByDate.map((group) => (
                  <div key={group.date} className="mb-6">
                    <h3 className="text-lg font-medium mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                      {group.formattedDate}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
                      {group.photos.map((photo, groupIndex) => {
                        // Calculate the global index for this photo
                        const globalIndex = convertedPhotos.findIndex(p => p.id === photo.id);
                        return (
                          <div key={photo.id} className="relative group">
                            <AspectRatio ratio={1} className="bg-muted">
                              <img 
                                src={photo.url} 
                                alt={photo.title}
                                className="object-cover w-full h-full cursor-pointer" 
                                loading="lazy"
                                onClick={() => handleOpenFullscreen(globalIndex)}
                              />
                            </AspectRatio>
                            <div className="absolute inset-0 flex items-start justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/30 text-white hover:bg-black/50 rounded-full h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenFullscreen(globalIndex);
                                }}
                              >
                                <Maximize className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="absolute left-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white hover:bg-black/50 h-7"
                            >
                              <Link to={`/photo/${photo.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-photo-500">No photos to display</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

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

export default OrganizedPhotoViewer;
