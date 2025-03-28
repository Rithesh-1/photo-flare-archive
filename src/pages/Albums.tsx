
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import CreateAlbumDialog from '@/components/CreateAlbumDialog';
import AlbumCard from '@/components/AlbumCard';
import { useAlbums } from '@/context/AlbumContext';

const AlbumsPage = () => {
  const { albums, deleteAlbum } = useAlbums();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      if ('detail' in e) {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.photoId) {
          setSelectedPhotoId(customEvent.detail.photoId);
          setIsCreateDialogOpen(true);
        }
      }
    };

    document.addEventListener('open-create-album-with-photo', handleEvent);
    
    return () => {
      document.removeEventListener('open-create-album-with-photo', handleEvent);
    };
  }, []);

  const handleCreateAlbum = () => {
    setSelectedPhotoId(undefined);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteAlbum = (id: string) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      deleteAlbum(id);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-photo-800">Albums</h1>
            <p className="text-photo-500 mt-1">
              Organize your photos into collections
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleCreateAlbum}>
            <Plus className="mr-2 h-4 w-4" />
            Create Album
          </Button>
        </div>
        
        {albums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-photo-100 flex items-center justify-center mb-4">
              <FolderPlus className="h-8 w-8 text-photo-400" />
            </div>
            <h3 className="text-xl font-semibold text-photo-800 mb-2">No albums yet</h3>
            <p className="text-photo-500 max-w-md mb-6">
              Create your first album to organize your photos into collections
            </p>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleCreateAlbum}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Album
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {albums.map((album) => (
              <AlbumCard 
                key={album.id} 
                album={album} 
                onDelete={handleDeleteAlbum} 
              />
            ))}
          </motion.div>
        )}
      </div>

      <CreateAlbumDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        initialPhotoId={selectedPhotoId}
      />
    </Layout>
  );
};

export default AlbumsPage;
