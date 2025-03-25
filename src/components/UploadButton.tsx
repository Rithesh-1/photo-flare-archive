
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

  const processUpload = async (file: File) => {
    try {
      setIsUploading(true);
      await uploadPhoto(file);
      toast.success('Photo uploaded successfully');
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
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 5MB');
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
