
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Folder, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const AlbumsPage = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-photo-800">Albums</h1>
            <p className="text-photo-500 mt-1">
              Organize your photos into collections
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Album
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-photo-100 flex items-center justify-center mb-4">
            <Folder className="h-8 w-8 text-photo-400" />
          </div>
          <h3 className="text-xl font-semibold text-photo-800 mb-2">No albums yet</h3>
          <p className="text-photo-500 max-w-md mb-6">
            Create your first album to organize your photos into collections
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Album
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AlbumsPage;
