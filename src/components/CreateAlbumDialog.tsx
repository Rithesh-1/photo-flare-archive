
import React, { useState, useEffect } from 'react';
import { useAlbums } from '@/context/AlbumContext';
import { usePhotos } from '@/context/PhotoContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Album, Check, X } from 'lucide-react';

interface CreateAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPhotoId?: string;
}

const CreateAlbumDialog: React.FC<CreateAlbumDialogProps> = ({
  open,
  onOpenChange,
  initialPhotoId,
}) => {
  const { addAlbum } = useAlbums();
  const { photos } = usePhotos();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setSelectedPhotoIds(initialPhotoId ? [initialPhotoId] : []);
      setIsCreating(false);
      setIsSuccess(false);
    }
  }, [open, initialPhotoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter an album name');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create the album
      const newAlbum = addAlbum(name, description, selectedPhotoIds);
      
      // Show success state
      setIsSuccess(true);
      
      // Close after showing success animation
      setTimeout(() => {
        onOpenChange(false);
        toast.success(`Album "${name}" created successfully`);
      }, 1200);
      
    } catch (error) {
      console.error('Error creating album:', error);
      toast.error('Failed to create album');
      setIsCreating(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-lg z-10 album-create-animation"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4"
              >
                <Check className="w-8 h-8" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold mb-2"
              >
                Album Created!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-muted-foreground"
              >
                {name} has been created with {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? 's' : ''}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Album className="h-5 w-5" />
                  Create New Album
                </DialogTitle>
                <DialogDescription>
                  Create a new album to organize your photos
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="album-name">Album Name</Label>
                  <Input
                    id="album-name"
                    placeholder="Enter album name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isCreating}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="album-description">Description (optional)</Label>
                  <Textarea
                    id="album-description"
                    placeholder="Enter album description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isCreating}
                    className="resize-none h-20"
                  />
                </div>
                
                {initialPhotoId ? (
                  <p className="text-sm text-muted-foreground">
                    This album will be created with 1 photo
                  </p>
                ) : (
                  <div className="space-y-2">
                    <Label>Select Photos (optional)</Label>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1">
                      {photos.slice(0, 8).map((photo) => (
                        <div 
                          key={photo.id}
                          className={`relative rounded overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedPhotoIds.includes(photo.id)
                              ? 'border-primary'
                              : 'border-transparent hover:border-muted'
                          }`}
                          onClick={() => togglePhotoSelection(photo.id)}
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.title}
                            className="w-full h-16 object-cover"
                          />
                          {selectedPhotoIds.includes(photo.id) && (
                            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <Check className="w-4 h-4" />
                              </motion.div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
                
                <DialogFooter className="mt-6">
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Album'}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumDialog;
