import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { analyzeImage } from '../utils/imageClassifier';

interface Photo {
  id: string;
  url: string; // For preview (low resolution)
  originalUrl: string; // Original high-quality image
  title: string;
  description?: string;
  createdAt: Date;
  classification?: {
    tags: string[];
    faces: number;
    quality: { score: number; issue?: string };
  };
}

interface PhotoContextType {
  photos: Photo[];
  loading: boolean;
  selectedPhoto: Photo | null;
  favorites: string[];
  uploadPhoto: (file: File, previewUrl?: string) => Promise<void>;
  selectPhoto: (photo: Photo) => void;
  clearSelectedPhoto: () => void;
  deletePhoto: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  downloadPhoto: (id: string) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    title: 'Working From Home',
    description: 'A woman sitting on a bed using a laptop',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    title: 'Laptop Setup',
    description: 'Gray laptop computer with dark background',
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    title: 'Circuit Board',
    description: 'Macro photography of black circuit board',
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    title: 'MacBook Pro',
    description: 'Person using MacBook Pro on a wooden desk',
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    title: 'Remote Work',
    description: 'Woman in white long sleeve shirt using black laptop computer',
    createdAt: new Date('2023-05-15')
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    title: 'Laptop Setup',
    description: 'Gray and black laptop computer on surface',
    createdAt: new Date('2023-06-22')
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    title: 'Home Office',
    description: 'Laptop computer on glass-top table',
    createdAt: new Date('2023-07-14')
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    title: 'Code Display',
    description: 'A MacBook with lines of code on its screen on a busy desk',
    createdAt: new Date('2023-08-30')
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    title: 'Team Work',
    description: 'People sitting down near table with assorted laptop computers',
    createdAt: new Date('2023-09-12')
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    title: 'Living Room',
    description: 'A living room with a couch and a table',
    createdAt: new Date('2023-10-05')
  },
];

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const createImageUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    });
  };

  const uploadPhoto = async (file: File, previewUrl?: string) => {
    try {
      const tempId = `temp-${Date.now()}`;
      
      const originalImageUrl = await createImageUrl(file);
      const displayUrl = previewUrl || originalImageUrl;
      
      const tempPhoto: Photo = {
        id: tempId,
        url: displayUrl,
        originalUrl: originalImageUrl,
        title: file.name.split('.')[0],
        description: `Uploading...`,
        createdAt: new Date(),
      };
      
      setPhotos(prev => [tempPhoto, ...prev]);
      
      toast.info('Processing image...', {
        duration: 1500,
      });
      
      try {
        const classification = await analyzeImage(file);
        
        const finalPhoto: Photo = {
          id: Date.now().toString(),
          url: displayUrl,
          originalUrl: originalImageUrl,
          title: file.name.split('.')[0],
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
          createdAt: new Date(),
          classification
        };
        
        setPhotos(prev => 
          prev.map(p => p.id === tempId ? finalPhoto : p)
        );
        
        const { faces, quality } = classification;
        const tagSummary = classification.tags.slice(0, 3).join(', ');
        
        toast.success('Image processed!', {
          description: 
            `${faces ? `${faces} face${faces > 1 ? 's' : ''}. ` : ''}` +
            `Quality: ${quality.score}%. Tags: ${tagSummary}`,
          duration: 2000,
        });
      } catch (error) {
        console.error('Analysis error:', error);
        
        const finalPhoto: Photo = {
          id: Date.now().toString(),
          url: displayUrl,
          originalUrl: originalImageUrl,
          title: file.name.split('.')[0],
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
          createdAt: new Date(),
        };
        
        setPhotos(prev => 
          prev.map(p => p.id === tempId ? finalPhoto : p)
        );
        
        toast.warning('Image uploaded but analysis failed', {
          duration: 2000,
        });
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 2500
      });
    }
  };

  const selectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const clearSelectedPhoto = () => {
    setSelectedPhoto(null);
  };

  const deletePhoto = (id: string) => {
    const photoToDelete = photos.find(photo => photo.id === id);
    
    if (photoToDelete) {
      try {
        if (photoToDelete.url && photoToDelete.url.startsWith('blob:')) {
          URL.revokeObjectURL(photoToDelete.url);
        }
        if (photoToDelete.originalUrl && photoToDelete.originalUrl.startsWith('blob:')) {
          URL.revokeObjectURL(photoToDelete.originalUrl);
        }
      } catch (error) {
        console.error("Error revoking object URLs:", error);
      }
    }
    
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    
    if (selectedPhoto && selectedPhoto.id === id) {
      clearSelectedPhoto();
    }
    
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
    }
    
    toast.success('Photo deleted', {
      duration: 1500
    });
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
      toast("Removed from favorites", {
        description: "Photo removed from favorites",
        duration: 2000
      });
    } else {
      setFavorites(prev => [...prev, id]);
      toast("Added to favorites", {
        description: "Photo added to favorites",
        duration: 2000
      });
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const downloadPhoto = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) {
      toast.error('Photo not found', {
        duration: 1500
      });
      return;
    }

    const link = document.createElement('a');
    link.href = photo.originalUrl;
    link.download = `${photo.title || 'photo'}.jpg`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Download started', {
      duration: 1500
    });
  };

  return (
    <PhotoContext.Provider value={{
      photos,
      loading,
      selectedPhoto,
      favorites,
      uploadPhoto,
      selectPhoto,
      clearSelectedPhoto,
      deletePhoto,
      toggleFavorite,
      isFavorite,
      downloadPhoto
    }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};
