import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Photo } from '@/types/photo';

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  photoIds: string[];
  createdAt: Date;
}

interface AlbumContextType {
  albums: Album[];
  createAlbum: (name: string, description?: string, initialPhotoIds?: string[]) => void;
  addPhotoToAlbum: (photoId: string, albumId: string) => void;
  removePhotoFromAlbum: (photoId: string, albumId: string) => void;
  deleteAlbum: (albumId: string) => void;
  updateAlbum: (albumId: string, data: Partial<Album>) => void;
  getAlbumPhotos: (albumId: string, photos: Photo[]) => Photo[];
  isPhotoInAlbum: (photoId: string, albumId: string) => boolean;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const AlbumProvider = ({ children }: { children: ReactNode }) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const handleOpenCreateAlbumWithPhoto = (event: Event) => {
      if ('detail' in event) {
        const customEvent = event as CustomEvent;
        console.log('Open create album with photo:', customEvent.detail?.photoId);
      }
    };

    document.addEventListener('open-create-album-with-photo', handleOpenCreateAlbumWithPhoto);
    
    return () => {
      document.removeEventListener('open-create-album-with-photo', handleOpenCreateAlbumWithPhoto);
    };
  }, []);

  const createAlbum = (name: string, description?: string, initialPhotoIds?: string[]) => {
    if (!name.trim()) {
      toast.error('Album name cannot be empty');
      return;
    }

    const photoIds = initialPhotoIds ? initialPhotoIds : [];

    const newAlbum: Album = {
      id: Date.now().toString(),
      name: name.trim(),
      description,
      photoIds,
      createdAt: new Date()
    };

    setAlbums(prev => [...prev, newAlbum]);
    toast.success('Album created', {
      description: `"${name}" has been created successfully${photoIds.length > 0 ? ` with ${photoIds.length} photos` : ''}`
    });
    
    return newAlbum;
  };

  const addPhotoToAlbum = (photoId: string, albumId: string) => {
    setAlbums(prev => 
      prev.map(album => {
        if (album.id === albumId && !album.photoIds.includes(photoId)) {
          return {
            ...album,
            photoIds: [...album.photoIds, photoId]
          };
        }
        return album;
      })
    );
  };

  const removePhotoFromAlbum = (photoId: string, albumId: string) => {
    setAlbums(prev => 
      prev.map(album => {
        if (album.id === albumId) {
          return {
            ...album,
            photoIds: album.photoIds.filter(id => id !== photoId)
          };
        }
        return album;
      })
    );
  };

  const deleteAlbum = (albumId: string) => {
    setAlbums(prev => prev.filter(album => album.id !== albumId));
    toast.success('Album deleted');
  };

  const updateAlbum = (albumId: string, data: Partial<Album>) => {
    setAlbums(prev => 
      prev.map(album => {
        if (album.id === albumId) {
          return { ...album, ...data };
        }
        return album;
      })
    );
    toast.success('Album updated');
  };

  const getAlbumPhotos = (albumId: string, photos: Photo[]): Photo[] => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return [];
    
    return photos.filter(photo => album.photoIds.includes(photo.id));
  };

  const isPhotoInAlbum = (photoId: string, albumId: string): boolean => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.photoIds.includes(photoId) : false;
  };

  return (
    <AlbumContext.Provider value={{
      albums,
      createAlbum,
      addPhotoToAlbum,
      removePhotoFromAlbum,
      deleteAlbum,
      updateAlbum,
      getAlbumPhotos,
      isPhotoInAlbum
    }}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbums = () => {
  const context = useContext(AlbumContext);
  if (context === undefined) {
    throw new Error('useAlbums must be used within an AlbumProvider');
  }
  return context;
};
