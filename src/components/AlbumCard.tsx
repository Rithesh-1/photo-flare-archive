
import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '@/context/AlbumContext';
import { Folder, Image, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AlbumCardProps {
  album: Album;
  onDelete: (id: string) => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onDelete }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {album.coverPhotoUrl ? (
          <img
            src={album.coverPhotoUrl}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Folder className="h-16 w-16 text-photo-400" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 truncate">
              {album.name}
            </h3>
            {album.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {album.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => onDelete(album.id)}>
                Delete album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Image className="h-3.5 w-3.5 mr-1" />
            <span>{album.photoIds.length} photos</span>
          </div>
          <span>{format(new Date(album.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
      
      <Link
        to={`/albums/${album.id}`}
        className={cn(
          "absolute inset-0 rounded-lg ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
      >
        <span className="sr-only">View album {album.name}</span>
      </Link>
    </div>
  );
};

export default AlbumCard;
