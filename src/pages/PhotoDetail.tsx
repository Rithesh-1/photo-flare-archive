
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { usePhotos } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Tag, Sparkles, Download, Trash2, Album, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAlbums } from '@/context/AlbumContext';
import CreateAlbumDialog from '@/components/CreateAlbumDialog';
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

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photos, toggleFavorite, isFavorite, deletePhoto, downloadPhoto } = usePhotos();
  const { albums, addPhotoToAlbum, removePhotoFromAlbum, isPhotoInAlbum } = useAlbums();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const photo = photos.find(p => p.id === id);
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden mb-4">
              <img 
                src={photo.url}
                alt={photo.title}
                className="w-full object-cover"
              />
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">{photo.title}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(photo.id)}
                  className={cn(
                    "transition-all",
                    isPhotoFavorite ? "text-red-500" : "text-gray-400"
                  )}
                >
                  <Heart className={cn(
                    "h-6 w-6 transition-all",
                    isPhotoFavorite && "fill-red-500"
                  )} />
                </Button>
              </div>
              
              {photo.description && (
                <p className="text-gray-600 mb-6">{photo.description}</p>
              )}
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">DETAILS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">
                      {photo.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Display classification data if available */}
                  {photo.classification && (
                    <>
                      <div className="border-t my-4 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={16} className="text-primary" />
                          <h3 className="text-sm font-medium text-gray-500">CLASSIFICATION</h3>
                        </div>
                        
                        {/* Image Quality */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Quality</span>
                            <span className="font-medium">
                              {photo.classification.quality.score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
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
                            <p className="text-xs text-gray-500 mt-1">
                              {photo.classification.quality.issue}
                            </p>
                          )}
                        </div>
                        
                        {/* Faces Detected */}
                        <div className="flex justify-between mb-3">
                          <span className="text-gray-600">Faces Detected</span>
                          <span className="font-medium">
                            {photo.classification.faces}
                          </span>
                        </div>
                        
                        {/* Tags */}
                        <div className="mt-4">
                          <div className="flex items-center gap-1 mb-2">
                            <Tag size={14} className="text-gray-500" />
                            <span className="text-gray-600 text-sm">Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {photo.classification.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-gray-100 text-gray-700"
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
    </Layout>
  );
};

export default PhotoDetail;
