
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Video, Upload, Loader2, AlertTriangle } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

interface VideoUploadButtonProps {
  onVideoUploaded: (videoData: {
    id: string;
    url: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    size: number;
    type: string;
  }) => void;
}

const VideoUploadButton: React.FC<VideoUploadButtonProps> = ({ onVideoUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const generateThumbnail = async (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        // Seek to a frame at 25% of the video
        video.currentTime = video.duration * 0.25;
      };
      
      video.onseeked = () => {
        // Create a canvas and draw the current video frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnailUrl);
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please select a video file (MP4, WebM, etc.)');
      setErrorDialogOpen(true);
      return false;
    }
    
    // 500MB limit for video files
    if (file.size > 500 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 500MB');
      setErrorDialogOpen(true);
      return false;
    }

    return true;
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 500);
    
    return interval;
  };

  const processUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Start simulated upload progress
      const progressInterval = simulateUploadProgress();
      
      // Generate a thumbnail from the video
      const thumbnailUrl = await generateThumbnail(file);
      
      // Create a video element to get metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      const videoMetadata = await new Promise<{duration: number}>((resolve, reject) => {
        video.onloadedmetadata = () => {
          resolve({ duration: video.duration });
        };
        video.onerror = () => {
          reject(new Error('Failed to load video metadata'));
        };
        video.src = URL.createObjectURL(file);
      });
      
      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cleanup progress simulation
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Create a URL for the video file
      const videoUrl = URL.createObjectURL(file);
      
      // Create a video object to return
      const videoData = {
        id: `video-${Date.now()}`,
        url: videoUrl,
        title: file.name.split('.')[0],
        thumbnailUrl,
        duration: videoMetadata.duration,
        size: file.size,
        type: file.type
      };
      
      // Wait a moment to show 100% progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onVideoUploaded(videoData);
      
      toast.success('Video uploaded successfully', {
        description: `"${videoData.title}" (${Math.round(videoData.duration)}s)`
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload video';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      setCurrentFile(null);
      setUploadProgress(0);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        variant="secondary"
        className="relative overflow-hidden transition-all duration-300"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading... {Math.round(uploadProgress)}%
          </>
        ) : (
          <>
            <Video className="mr-2 h-4 w-4" />
            Upload Video
          </>
        )}
      </Button>
      
      {isUploading && (
        <Progress value={uploadProgress} className="w-full h-1 mt-1" />
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
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

export default VideoUploadButton;
