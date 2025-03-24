
import React from 'react';
import Layout from '@/components/Layout';
import PhotoGrid from '@/components/PhotoGrid';
import UploadButton from '@/components/UploadButton';
import { PhotoProvider } from '@/context/PhotoContext';

const Index = () => {
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
            <UploadButton />
          </div>
          <PhotoGrid />
        </div>
      </Layout>
    </PhotoProvider>
  );
};

export default Index;
