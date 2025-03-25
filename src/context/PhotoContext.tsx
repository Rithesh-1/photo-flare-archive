
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
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const uploadPhoto = async (file: File, previewUrl?: string) => {
    try {
      setLoading(true);
      
      // If no preview URL was provided, create one
      const displayUrl = previewUrl || URL.createObjectURL(file);
      
      // For the original URL, we store the raw file as a blob URL
      // In a real-world app, this would be uploaded to a storage service
      const originalUrl = URL.createObjectURL(file);
      
      // Show toast notification that classification is in progress
      toast.info('Analyzing image...', {
        duration: 3000,
      });
      
      // Analyze the image using our classifier utility
      const classification = await analyzeImage(file);
      
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: displayUrl,
        originalUrl: originalUrl,
        title: file.name.split('.')[0],
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
        createdAt: new Date(),
        classification
      };
      
      setPhotos(prev => [newPhoto, ...prev]);
      
      // Show notification with classification summary
      const { faces, quality } = classification;
      const tagSummary = classification.tags.slice(0, 3).join(', ');
      
      toast.success('Photo uploaded and analyzed!', {
        description: 
          `${faces ? `Detected ${faces} face${faces > 1 ? 's' : ''}. ` : ''}` +
          `Quality: ${quality.score}%. Tags: ${tagSummary}`,
        duration: 5000,
      });
      
    } catch (error) {
      toast.error('Failed to upload or analyze photo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const clearSelectedPhoto = () => {
    setSelectedPhoto(null);
  };

  const deletePhoto = (id: string) => {
    // Get the photo to clean up URLs before removing
    const photoToDelete = photos.find(photo => photo.id === id);
    
    if (photoToDelete) {
      // Clean up any blob URLs to prevent memory leaks
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
    // Also remove from favorites if it exists there
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
    }
    toast.success('Photo deleted successfully');
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(favId => favId !== id));
      toast("Removed from favorites", {
        description: "Photo has been removed from your favorites"
      });
    } else {
      setFavorites(prev => [...prev, id]);
      toast("Added to favorites", {
        description: "Photo has been added to your favorites"
      });
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const downloadPhoto = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) {
      toast.error('Photo not found');
      return;
    }

    // Create an invisible link to trigger the download
    const link = document.createElement('a');
    link.href = photo.originalUrl;
    link.download = `${photo.title || 'photo'}.jpg`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Photo download started');
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
