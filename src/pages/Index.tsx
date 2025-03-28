
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PhotoGrid from '@/components/PhotoGrid';
import UploadButton from '@/components/UploadButton';
import { PhotoProvider } from '@/context/PhotoContext';
import { Button } from '@/components/ui/button';
import { Plus, Album } from 'lucide-react';
import CreateAlbumDialog from '@/components/CreateAlbumDialog';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateAlbum = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <PhotoProvider>
      <Layout>
        <div className="py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-photo-800">Photos</h1>
              <p className="text-photo-500 mt-1">
                View, organize, and share all your photos
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleCreateAlbum}
              >
                <Album className="h-4 w-4" />
                Create Album
              </Button>
              <UploadButton />
            </div>
          </div>
          <PhotoGrid />
        </div>

        <CreateAlbumDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </Layout>
    </PhotoProvider>
  );
};

export default Index;
