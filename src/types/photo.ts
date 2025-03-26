
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
}
