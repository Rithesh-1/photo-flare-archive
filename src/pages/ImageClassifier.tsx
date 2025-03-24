
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload, Sparkles, ImageIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ImageClassifier = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ label: string; confidence: number }> | null>(null);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    toast(isEnabled ? 'Classifier disabled' : 'Classifier enabled');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImagePreview(e.target.result as string);
            // Simulate classification
            setTimeout(() => {
              simulateClassification();
            }, 1500);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const simulateClassification = () => {
    // Mock classification results - in a real app, this would be an API call
    const mockResults = [
      { label: 'Landscape', confidence: 0.92 },
      { label: 'Nature', confidence: 0.85 },
      { label: 'Outdoors', confidence: 0.73 },
      { label: 'Sunset', confidence: 0.68 },
    ];
    
    setResults(mockResults);
    toast.success('Image classified successfully!');
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mr-2"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-photo-800">
              Intelligent Image Classifier
            </h1>
            <p className="text-photo-500 mt-1">
              Automatically tag and categorize your photos
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="classifier-mode" checked={isEnabled} onCheckedChange={handleToggle} />
            <Label htmlFor="classifier-mode">Enable Classifier</Label>
          </div>
        </div>

        {isEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
                isHovering ? "border-primary/70" : ""
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 rounded-md mb-4 object-contain"
                />
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <ImageIcon size={30} className="text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2">Drop an image here</h3>
                  <p className="text-photo-500 text-center mb-6">
                    or browse your files to upload
                  </p>
                </>
              )}
              
              <Button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                {imagePreview ? 'Upload Another Image' : 'Upload Image'}
              </Button>
              <input 
                type="file" 
                id="file-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-primary" />
                <h3 className="text-lg font-medium">Classification Results</h3>
              </div>

              {results ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{result.label}</span>
                        <span className="text-photo-500">{(result.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={simulateClassification} className="w-full">
                      Analyze Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-photo-400 mb-4">
                    <Sparkles size={40} />
                  </div>
                  <p className="text-photo-500 text-center">
                    {imagePreview ? 'Analyzing your image...' : 'Upload an image to see classification results'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed p-12 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-photo-100 flex items-center justify-center mb-4"
            >
              <Sparkles size={30} className="text-photo-400" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Enable the classifier</h3>
            <p className="text-photo-500 text-center max-w-md mb-6">
              Turn on the image classifier to automatically analyze and tag your photos
            </p>
            <Button onClick={handleToggle}>Enable Classifier</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ImageClassifier;
