
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  poster,
  autoPlay = false,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [currentQuality, setCurrentQuality] = useState('Auto');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const onTimeUpdate = () => setCurrentTime(video.currentTime);
      const onDurationChange = () => setDuration(video.duration);
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onVolumeChange = () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
      };
      
      // Event listeners
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('durationchange', onDurationChange);
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      video.addEventListener('volumechange', onVolumeChange);
      
      // Check if fullscreen mode changes
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      
      // Mock available qualities for demonstration
      setAvailableQualities(['Auto', '1080p', '720p', '480p', '360p']);
      
      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('durationchange', onDurationChange);
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('volumechange', onVolumeChange);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        if (isPlaying) setShowControls(false);
      });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
        container.removeEventListener('mouseleave', () => {
          if (isPlaying) setShowControls(false);
        });
      }
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const volumeValue = newVolume[0];
      videoRef.current.volume = volumeValue;
      if (volumeValue === 0) {
        videoRef.current.muted = true;
      } else if (isMuted) {
        videoRef.current.muted = false;
      }
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0];
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    // In a real implementation, you would switch video sources or use adaptive streaming
    console.log(`Quality changed to ${quality}`);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-black",
        isFullscreen ? "fixed inset-0 z-50" : "w-full",
        className
      )}
      onDoubleClick={toggleFullscreen}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        autoPlay={autoPlay}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Video controls */}
      <div 
        className={cn(
          "absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          "bg-gradient-to-t from-black/70 to-transparent"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar - Title */}
        <div className="text-white text-lg font-medium drop-shadow-md">
          {title}
        </div>
        
        {/* Bottom controls */}
        <div className="space-y-2">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-white text-xs">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-white text-xs">{formatTime(duration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex items-center gap-1 w-28">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Quality</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableQualities.map((quality) => (
                    <DropdownMenuItem
                      key={quality}
                      className={cn(
                        "cursor-pointer",
                        quality === currentQuality && "font-medium bg-primary/10"
                      )}
                      onClick={() => handleQualityChange(quality)}
                    >
                      {quality}
                      {quality === currentQuality && " ✓"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
