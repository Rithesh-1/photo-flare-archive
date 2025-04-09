
import React, { useState, useMemo } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { useDatabase } from '@/context/DatabaseContext';
import { Photo } from '@/types/photo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar, Database, Image } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface OrganizedPhotoViewerProps {
  className?: string;
}

const OrganizedPhotoViewer: React.FC<OrganizedPhotoViewerProps> = ({ className }) => {
  const { photos, loading } = usePhotos();
  const { mode, isOffline, syncStatus, pendingChanges } = useDatabase();
  const [viewMode, setViewMode] = useState<'grid' | 'date'>('grid');

  // Group photos by date
  const photosByDate = useMemo(() => {
    const groups: { [key: string]: Photo[] } = {};
    
    photos.forEach(photo => {
      const date = new Date(photo.createdAt);
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
  }, [photos]);

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
              {photos.map((photo) => (
                <Link to={`/photo/${photo.id}`} key={photo.id} className="block w-full">
                  <div className="relative group">
                    <AspectRatio ratio={1} className="bg-muted">
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        className="object-cover w-full h-full" 
                        loading="lazy"
                      />
                    </AspectRatio>
                  </div>
                </Link>
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
                      {group.photos.map((photo) => (
                        <Link to={`/photo/${photo.id}`} key={photo.id} className="block w-full">
                          <div className="relative">
                            <AspectRatio ratio={1} className="bg-muted">
                              <img 
                                src={photo.url} 
                                alt={photo.title}
                                className="object-cover w-full h-full" 
                                loading="lazy"
                              />
                            </AspectRatio>
                          </div>
                        </Link>
                      ))}
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
    </div>
  );
};

export default OrganizedPhotoViewer;
