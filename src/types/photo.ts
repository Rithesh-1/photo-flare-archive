
export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  dateAdded: string; // ISO string
  isFavorite: boolean;
  albumId?: string;
  thumbnailUrl?: string;
  originalUrl?: string;
  classification?: {
    tags: string[];
    faces: number;
    quality: { 
      score: number; 
      issue?: string 
    };
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
