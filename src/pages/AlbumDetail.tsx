
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PhotoCard from '@/components/PhotoCard';
import { useAlbums } from '@/context/AlbumContext';
import { usePhotos } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { Photo as PhotoType } from '@/types/photo';

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { albums, getAlbumPhotos, deleteAlbum } = useAlbums();
  const { photos } = usePhotos();

  const album = albums.find(a => a.id === id);
  
  if (!album) {
    return (
      <Layout>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-semibold text-photo-800 mb-4">Album not found</h2>
          <p className="text-photo-500 mb-6">The album you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/albums')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Albums
          </Button>
        </div>
      </Layout>
    );
  }

  // Convert photos to the expected format
  const convertedPhotos = photos.map(photo => ({
    id: photo.id,
    url: photo.url,
    title: photo.title,
    description: photo.description,
    tags: photo.classification?.tags || [],
    dateAdded: photo.createdAt?.toISOString() || new Date().toISOString(),
    isFavorite: false,
    albumId: album.photoIds.includes(photo.id) ? album.id : undefined,
    thumbnailUrl: photo.url
  })) as PhotoType[];

  const albumPhotos = getAlbumPhotos(album.id, convertedPhotos);

  const handleDeleteAlbum = () => {
    if (window.confirm(`Are you sure you want to delete "${album.name}"? This cannot be undone.`)) {
      deleteAlbum(album.id);
      navigate('/albums');
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/albums">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              All Albums
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-photo-800">{album.name}</h1>
            {album.description && (
              <p className="text-photo-500 mt-1">{album.description}</p>
            )}
            <p className="text-sm text-photo-400 mt-2">
              {albumPhotos.length} {albumPhotos.length === 1 ? 'photo' : 'photos'} • Created {album.createdAt.toLocaleDateString()}
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteAlbum}
            className="self-start"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete Album
          </Button>
        </div>
        
        {albumPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-photo-100 flex items-center justify-center mb-4">
              <Image className="h-8 w-8 text-photo-400" />
            </div>
            <h3 className="text-xl font-semibold text-photo-800 mb-2">No photos in this album</h3>
            <p className="text-photo-500 max-w-md mb-6">
              Add photos to this album from the gallery.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Gallery
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {albumPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                id={photo.id}
                url={photo.url || photo.thumbnailUrl || ''}
                title={photo.title}
              />
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default AlbumDetail;
