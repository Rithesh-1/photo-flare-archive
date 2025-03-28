
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAlbums } from '@/context/AlbumContext';

const formSchema = z.object({
  name: z.string().min(1, 'Album name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const { createAlbum } = useAlbums();
  const [photoToAdd, setPhotoToAdd] = useState<string | undefined>(initialPhotoId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Listen for global event to open dialog with a specific photo
  useEffect(() => {
    const handleOpenWithPhoto = () => {
      if (!open) {
        onOpenChange(true);
      }
    };

    document.addEventListener('open-create-album-with-photo', handleOpenWithPhoto);
    
    return () => {
      document.removeEventListener('open-create-album-with-photo', handleOpenWithPhoto);
    };
  }, [open, onOpenChange]);
  
  // Update photoToAdd when initialPhotoId changes
  useEffect(() => {
    setPhotoToAdd(initialPhotoId);
  }, [initialPhotoId]);

  const onSubmit = (values: FormValues) => {
    createAlbum(values.name, values.description, photoToAdd);
    form.reset();
    setPhotoToAdd(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Vacation 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Photos from our beach trip" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {photoToAdd && (
              <div className="text-sm text-muted-foreground">
                A photo will be added to this album upon creation.
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Create Album</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumDialog;
