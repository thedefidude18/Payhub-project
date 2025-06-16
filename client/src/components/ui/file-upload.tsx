import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, File, Image, Video, Music } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
}

export default function FileUpload({ 
  onFileSelect, 
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
    'application/pdf': ['.pdf'],
  },
  maxSize = 100 * 1024 * 1024, // 100MB
  multiple = true 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const getFileIcon = (fileType: string) => {
    const type = fileType.split('/')[0];
    switch (type) {
      case 'image': return <Image className="h-8 w-8 text-blue-500" />;
      case 'video': return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio': return <Music className="h-8 w-8 text-green-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive || dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-4 rounded-full transition-colors
              ${isDragActive || dragActive ? 'bg-primary/10' : 'bg-gray-50'}
            `}>
              <Upload className={`
                h-8 w-8 transition-colors
                ${isDragActive || dragActive ? 'text-primary' : 'text-gray-400'}
              `} />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                {isDragActive ? 'Drop files here' : 'Choose files or drag and drop'}
              </p>
              <p className="text-sm text-gray-500">
                Support for videos, images, audio, and PDFs up to {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>

            <Button type="button" variant="outline">
              Browse Files
            </Button>
          </div>
        </div>

        {/* Supported formats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Image className="h-4 w-4 text-blue-500" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Video className="h-4 w-4 text-purple-500" />
            <span>Videos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Music className="h-4 w-4 text-green-500" />
            <span>Audio</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <File className="h-4 w-4 text-red-500" />
            <span>PDFs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
