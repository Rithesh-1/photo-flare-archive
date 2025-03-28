
import React from 'react';
import { useAlbums } from '@/context/AlbumContext';
import { Album } from '../types/album';
import { Button } from '@/components/ui/button';
import { Album as AlbumIcon, Plus, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface AddToAlbumDropdownProps {
  photoId: string;
}

const AddToAlbumDropdown: React.FC<AddToAlbumDropdownProps> = ({ photoId }) => {
  const { albums, addPhotoToAlbum, removePhotoFromAlbum, isPhotoInAlbum } = useAlbums();
  const { toast } = useToast();

  const handleAddToAlbum = (album: Album) => {
    const isInAlbum = isPhotoInAlbum(photoId, album.id);
    
    if (isInAlbum) {
      removePhotoFromAlbum(photoId, album.id);
      toast({
        title: "Removed from album",
        description: `Photo removed from "${album.name}"`,
      });
    } else {
      addPhotoToAlbum(photoId, album.id);
      toast({
        title: "Added to album",
        description: `Photo added to "${album.name}"`,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlbumIcon className="h-4 w-4" />
          <span className="sr-only">Add to album</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Add to Album</DropdownMenuLabel>
        
        {albums.length === 0 ? (
          <DropdownMenuItem disabled className="text-muted-foreground">
            No albums available
          </DropdownMenuItem>
        ) : (
          albums.map((album) => {
            const isInAlbum = isPhotoInAlbum(photoId, album.id);
            return (
              <DropdownMenuItem
                key={album.id}
                onClick={() => handleAddToAlbum(album)}
                className="flex items-center justify-between"
              >
                <span>{album.name}</span>
                {isInAlbum && <Check className="h-4 w-4 ml-2 text-primary" />}
              </DropdownMenuItem>
            );
          })
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center text-primary"
          onClick={() => {
            // Create new album dialog link
            document.dispatchEvent(new Event('open-create-album-with-photo'));
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Album
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToAlbumDropdown;
