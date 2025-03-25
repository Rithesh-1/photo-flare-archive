
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { usePhotos } from '@/context/PhotoContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const UploadButton = () => {
  const { uploadPhoto } = usePhotos();
  const [isUploading, setIsUploading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const createOptimizedPreview = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Create a preview that's fast to display while maintaining the original
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create a canvas to resize the image for preview
          const canvas = document.createElement('canvas');
          // Calculate scaled dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw the resized image
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Get the data URL (lower quality for preview)
            const previewUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(previewUrl);
          } else {
            // Fallback to original if canvas fails
            resolve(URL.createObjectURL(file));
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create a preview version for fast display
      const previewUrl = await createOptimizedPreview(file);
      
      // Upload the original file with the preview
      await uploadPhoto(file, previewUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload photo';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      setCurrentFile(null);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (JPEG, PNG, GIF, etc.)');
      setErrorDialogOpen(true);
      return false;
    }
    
    // Increased size limit to 50MB to allow for higher quality images
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 50MB');
      setErrorDialogOpen(true);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setCurrentFile(file);
    
    if (validateFile(file)) {
      processUpload(file);
    } else {
      // Reset the file input if validation fails
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRetry = () => {
    if (currentFile && validateFile(currentFile)) {
      processUpload(currentFile);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={isUploading}
        className={cn(
          "relative overflow-hidden transition-all duration-300 bg-primary hover:bg-primary/90",
          isUploading && "pointer-events-none"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </>
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Upload Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {currentFile && (
              <AlertDialogAction onClick={handleRetry}>Retry</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UploadButton;
