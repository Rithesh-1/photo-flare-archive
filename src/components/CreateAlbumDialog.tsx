import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAlbums } from '@/context/AlbumContext';
import { useNavigate } from 'react-router-dom';
import GalleryPhotoSelector from './GalleryPhotoSelector';

interface CreateAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPhotoId?: string;
}

const CreateAlbumDialog: React.FC<CreateAlbumDialogProps> = ({ 
  open, 
  onOpenChange,
  initialPhotoId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { createAlbum } = useAlbums();
  const navigate = useNavigate();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setSelectedPhotoIds(initialPhotoId ? [initialPhotoId] : []);
      setIsCreating(false);
    }
  }, [open, initialPhotoId]);

  const handleSelectPhoto = (photoId: string) => {
    setSelectedPhotoIds(prev => {
      // If the photo is already selected, remove it
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } 
      // Otherwise add it
      return [...prev, photoId];
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    setIsCreating(true);
    
    try {
      const newAlbum = createAlbum(
        name.trim(), 
        description.trim() || undefined, 
        selectedPhotoIds.length > 0 ? selectedPhotoIds : undefined
      );
      
      onOpenChange(false);
      
      // Navigate to the new album
      if (newAlbum) {
        setTimeout(() => {
          navigate(`/album/${newAlbum.id}`);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to create album:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
          <DialogDescription>
            Create a new album to organize your photos
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="album-name">Album Name</Label>
            <Input
              id="album-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter album name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="album-description">Description (optional)</Label>
            <Textarea
              id="album-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter album description"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2 mt-2">
            <Label>Select Photos</Label>
            <GalleryPhotoSelector 
              selectedPhotoIds={selectedPhotoIds}
              onSelectPhoto={handleSelectPhoto}
              initialPhotoId={initialPhotoId}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumDialog;
