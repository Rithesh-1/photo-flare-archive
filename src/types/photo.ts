export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  albumIds: string[];
  isFavorite: boolean;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}
