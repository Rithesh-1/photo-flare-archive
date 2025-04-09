
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { usePhotos } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Heart, Tag, Sparkles, Download, Trash2, 
  Album, Plus, Maximize, ChevronLeft, ChevronRight, 
  MapPin, Edit, Calendar, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAlbums } from '@/context/AlbumContext';
import CreateAlbumDialog from '@/components/CreateAlbumDialog';
import FullscreenImageViewer from '@/components/FullscreenImageViewer';
import { Photo } from '@/types/photo';
import GenerateImageDescription from '@/components/GenerateImageDescription';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photos, toggleFavorite, isFavorite, deletePhoto, downloadPhoto } = usePhotos();
  const { albums, addPhotoToAlbum, removePhotoFromAlbum, isPhotoInAlbum } = useAlbums();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  
  const photo = photos.find(p => p.id === id);
  
  // Get previous and next photo IDs for navigation
  const currentIndex = photos.findIndex(p => p.id === id);
  const prevPhotoId = currentIndex > 0 ? photos[currentIndex - 1].id : null;
  const nextPhotoId = currentIndex < photos.length - 1 ? photos[currentIndex + 1].id : null;
  
  // Convert photos to the Photo type format for fullscreen viewer
  const convertedPhotos: Photo[] = photos.map(p => ({
    id: p.id,
    url: p.url,
    title: p.title,
    description: p.description || '',
    date: p.createdAt?.toISOString() || new Date().toISOString(),
    tags: p.classification?.tags || [],
    albumIds: p.albumId ? [p.albumId] : [], // Correctly use albumId in the conversion
    isFavorite: isFavorite(p.id),
    originalUrl: p.originalUrl,
    thumbnailUrl: p.url,
    classification: p.classification,
    location: p.location // Include location in converted photos
  }));
  
  // Reset edited values when photo changes
  useEffect(() => {
    if (photo) {
      setEditedTitle(photo.title);
      setEditedDescription(photo.description || '');
      setIsEditing(false);
    }
  }, [photo]);
  
  if (!photo) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-medium mb-4">Photo not found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </Layout>
    );
  }
  
  const isPhotoFavorite = isFavorite(photo.id);
  
  const handleDelete = () => {
    deletePhoto(photo.id);
    navigate('/');
  };
  
  const handleDownload = () => {
    downloadPhoto(photo.id);
  };

  const handleAddToAlbum = (albumId: string) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;

    const isInAlbum = isPhotoInAlbum(photo.id, albumId);
    
    if (isInAlbum) {
      removePhotoFromAlbum(photo.id, albumId);
    } else {
      addPhotoToAlbum(photo.id, albumId);
    }
  };

  const handleCreateNewAlbum = () => {
    setIsCreateDialogOpen(true);
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const navigateToPhoto = (photoId: string | null) => {
    if (photoId) {
      navigate(`/photo/${photoId}`);
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleSaveEdits = () => {
    // In a real app, you would update the photo in your state or database
    toast.success('Photo details updated');
    setIsEditing(false);
  };

  const handleDescriptionGenerated = (description: string) => {
    setEditedDescription(description);
    if (!isEditing) {
      setIsEditing(true);
    }
  };
  
  return (
    <Layout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mr-2"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Photos
            </Link>
          </Button>
          
          <div className="flex gap-2">
            {prevPhotoId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateToPhoto(prevPhotoId)}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            
            {nextPhotoId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateToPhoto(nextPhotoId)}
                className="flex items-center"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden mb-4 relative group">
              <img 
                src={photo.url}
                alt={photo.title}
                className="w-full object-cover cursor-pointer"
                onClick={openFullscreen}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={openFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Album className="h-4 w-4 mr-1" />
                      Add to Album
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Add to Album</DropdownMenuLabel>
                    
                    {albums.length === 0 ? (
                      <DropdownMenuItem disabled className="text-muted-foreground">
                        No albums available
                      </DropdownMenuItem>
                    ) : (
                      albums.map((album) => {
                        const isInAlbum = isPhotoInAlbum(photo.id, album.id);
                        return (
                          <DropdownMenuItem
                            key={album.id}
                            onClick={() => handleAddToAlbum(album.id)}
                            className="flex items-center justify-between"
                          >
                            <span>{album.name}</span>
                            {isInAlbum && <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>✓</motion.span>}
                          </DropdownMenuItem>
                        );
                      })
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center text-primary"
                      onClick={handleCreateNewAlbum}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Album
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Original
                </Button>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the photo. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div 
                      key="editing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1"
                    >
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-xl font-semibold mb-2"
                        placeholder="Photo title"
                      />
                    </motion.div>
                  ) : (
                    <motion.h1 
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-2xl font-semibold"
                    >
                      {photo.title}
                    </motion.h1>
                  )}
                </AnimatePresence>
                
                <div className="flex gap-2">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSaveEdits}
                          className="text-primary"
                        >
                          <Save className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleStartEditing}
                          className="text-muted-foreground"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(photo.id)}
                    className={cn(
                      "transition-all",
                      isPhotoFavorite ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    <Heart className={cn(
                      "h-5 w-5 transition-all",
                      isPhotoFavorite && "fill-red-500"
                    )} />
                  </Button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6"
                  >
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="resize-none h-28"
                      placeholder="Add a description..."
                    />
                  </motion.div>
                ) : (
                  photo.description && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-muted-foreground mb-6"
                    >
                      {photo.description}
                    </motion.p>
                  )
                )}
              </AnimatePresence>
              
              {isEditing && (
                <div className="mb-6">
                  <GenerateImageDescription
                    imageUrl={photo.url}
                    onDescriptionGenerated={handleDescriptionGenerated}
                  />
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">DETAILS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      Created
                    </span>
                    <span className="font-medium">
                      {photo.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  {photo.location && (
                    <div className="flex justify-between items-start">
                      <span className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        Location
                      </span>
                      <span className="font-medium text-right">
                        {photo.location.address || `${photo.location.latitude.toFixed(6)}, ${photo.location.longitude.toFixed(6)}`}
                      </span>
                    </div>
                  )}
                  
                  {/* Display classification data if available */}
                  {photo.classification && (
                    <>
                      <div className="border-t my-4 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={16} className="text-primary" />
                          <h3 className="text-sm font-medium text-muted-foreground">CLASSIFICATION</h3>
                        </div>
                        
                        {/* Image Quality */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Quality</span>
                            <span className="font-medium">
                              {photo.classification.quality.score}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div 
                              className={cn(
                                "h-2 rounded-full",
                                photo.classification.quality.score > 70 
                                  ? "bg-green-500" 
                                  : photo.classification.quality.score > 40 
                                    ? "bg-yellow-500" 
                                    : "bg-red-500"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${photo.classification.quality.score}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          {photo.classification.quality.issue && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {photo.classification.quality.issue}
                            </p>
                          )}
                        </div>
                        
                        {/* Faces Detected */}
                        <div className="flex justify-between mb-3">
                          <span className="text-muted-foreground">Faces Detected</span>
                          <span className="font-medium">
                            {photo.classification.faces}
                          </span>
                        </div>
                        
                        {/* Tags */}
                        <div className="mt-4">
                          <div className="flex items-center gap-1 mb-2">
                            <Tag size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground text-sm">Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {photo.classification.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-secondary text-secondary-foreground"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateAlbumDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        initialPhotoId={photo.id}
      />
      
      {/* Fullscreen image viewer */}
      <FullscreenImageViewer
        photos={convertedPhotos}
        currentIndex={currentIndex}
        isOpen={isFullscreenOpen}
        onClose={closeFullscreen}
        onNavigate={(index) => {
          if (index !== currentIndex) {
            navigate(`/photo/${convertedPhotos[index].id}`);
          }
        }}
      />
    </Layout>
  );
};

export default PhotoDetail;
