
export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  albumIds: string[];
  isFavorite: boolean;
  
  // Optional properties used across components
  thumbnailUrl?: string;
  originalUrl?: string;
  dateAdded?: string; // For backward compatibility
  albumId?: string; // For backward compatibility
  
  // Classification data for AI features
  classification?: {
    tags: string[];
    faces: number;
    quality: { 
      score: number; 
      issue?: string 
    };
  };
  
  // Metadata for image details
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
  
  // Location data for geo features
  location?: {
    latitude: number;
    longitude: number;
    name: string;
    address?: string;
  };
}
