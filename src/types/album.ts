
export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  photoIds: string[];
  createdAt: Date;
}
