
import React from 'react';
import Layout from '@/components/Layout';
import OrganizedPhotoViewer from '@/components/OrganizedPhotoViewer';
import { PhotoProvider } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UploadButton from '@/components/UploadButton';
import CreateAlbumDialog from '@/components/CreateAlbumDialog';
import { useState } from 'react';

const Organize = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <PhotoProvider>
      <Layout>
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-photo-800">Organize</h1>
              <p className="text-photo-500 mt-1">
                View and organize your photos by different layouts
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create Album
              </Button>
              <UploadButton />
            </div>
          </div>
          
          <OrganizedPhotoViewer />
        </div>
        
        <CreateAlbumDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </Layout>
    </PhotoProvider>
  );
};

export default Organize;
