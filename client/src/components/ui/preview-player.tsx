import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Download, Maximize, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PreviewPlayerProps {
  file: any;
  project: any;
  onTimeUpdate?: (time: number) => void;
  onComment?: (time: number) => void;
}

export default function PreviewPlayer({ file, project, onTimeUpdate, onComment }: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showWatermark, setShowWatermark] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const trackPlayMutation = useMutation({
    mutationFn: async (eventData: any) => {
      await apiRequest("POST", "/api/analytics", {
        projectId: project.id,
        event: eventData.event,
        metadata: eventData.metadata,
      });
    },
  });

  useEffect(() => {
    const media = videoRef.current || audioRef.current;
    if (!media) return;

    const handleTimeUpdate = () => {
      const time = media.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);

      // Check for time limits
      const timeLimit = project.previewSettings?.timeLimit;
      if (timeLimit && time >= timeLimit) {
        media.pause();
        setIsPlaying(false);
        trackPlayMutation.mutate({
          event: "preview_limit_reached",
          metadata: { timeLimit, actualTime: time },
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
    };

    const handlePlay = () => {
      trackPlayMutation.mutate({
        event: "play",
        metadata: { currentTime: media.currentTime },
      });
    };

    const handlePause = () => {
      trackPlayMutation.mutate({
        event: "pause",
        metadata: { currentTime: media.currentTime },
      });
    };

    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("loadedmetadata", handleLoadedMetadata);
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);

    return () => {
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("loadedmetadata", handleLoadedMetadata);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
    };
  }, [project, onTimeUpdate, trackPlayMutation]);

  const togglePlay = () => {
    const media = videoRef.current || audioRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const media = videoRef.current || audioRef.current;
    if (!media) return;

    media.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const media = videoRef.current || audioRef.current;
    if (media) {
      media.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const media = videoRef.current || audioRef.current;
    if (media) {
      media.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCommentAtTime = () => {
    onComment?.(currentTime);
  };

  const renderVideoPlayer = () => (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={file.previewPath || file.filePath}
        className="w-full h-auto"
        poster={file.thumbnailPath}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        disablePictureInPicture
        controlsList="nodownload"
      />
      
      {/* Watermark */}
      {showWatermark && project.previewSettings?.watermark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            PREVIEW - {project.title}
          </div>
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            PayHub Preview
          </div>
        </div>
      )}
      
      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentAtTime}
              className="text-white hover:bg-white/20"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Time Limit Warning */}
        {project.previewSettings?.timeLimit && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Preview limited to {formatTime(project.previewSettings.timeLimit)}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );

  const renderAudioPlayer = () => (
    <div className="bg-gray-100 rounded-lg p-6">
      <audio
        ref={audioRef}
        src={file.previewPath || file.filePath}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="text-center mb-6">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
            {isPlaying ? (
              <Pause className="h-12 w-12 text-primary" />
            ) : (
              <Play className="h-12 w-12 text-primary" />
            )}
          </div>
        </div>
        <h3 className="font-medium text-lg">{file.originalName}</h3>
        <p className="text-gray-600">{project.title}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={togglePlay} size="sm">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCommentAtTime}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderImageViewer = () => (
    <div className="relative">
      <img
        src={file.previewPath || file.filePath}
        alt={file.originalName}
        className="w-full h-auto rounded-lg"
      />
      
      {showWatermark && project.previewSettings?.watermark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            PREVIEW - {project.title}
          </div>
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            PayHub Preview
          </div>
        </div>
      )}
    </div>
  );

  const renderPDFViewer = () => (
    <div className="bg-gray-100 rounded-lg p-6 text-center">
      <div className="w-32 h-32 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-red-600 font-bold text-2xl">PDF</span>
      </div>
      <h3 className="font-medium text-lg mb-2">{file.originalName}</h3>
      <p className="text-gray-600 mb-4">PDF preview not available</p>
      <Badge variant="secondary">
        Full PDF available after payment
      </Badge>
    </div>
  );

  const getPlayerByFileType = () => {
    const type = file.fileType;
    switch (type) {
      case 'video':
        return renderVideoPlayer();
      case 'audio':
        return renderAudioPlayer();
      case 'image':
        return renderImageViewer();
      default:
        return renderPDFViewer();
    }
  };

  return (
    <div className="space-y-4">
      {getPlayerByFileType()}
      
      {/* File Info */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium">{file.originalName}</p>
          <p className="text-sm text-gray-600">
            {file.fileType} • {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {project.previewSettings?.watermark && (
            <Badge variant="outline" className="text-xs">
              Watermarked Preview
            </Badge>
          )}
          {project.status !== 'paid' && project.status !== 'delivered' && (
            <Badge variant="secondary" className="text-xs">
              Preview Only
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
