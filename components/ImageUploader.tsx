"use client";

import { useState, useEffect } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  onVideoChange?: (isVideo: boolean) => void;
  accept?: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onFileSelect,
  onVideoChange,
  accept = "image/*,video/*",
  label = "Image Upload"
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    // Reset when value changes externally (but keep selected file if it exists)
    if (!value && !selectedFile) {
      setPreviewUrl(null);
    } else if (value && !selectedFile) {
      setIsVideo(value.includes(".mp4") || value.includes(".mov") || value.includes(".webm"));
    }
  }, [value, selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const fileIsVideo = file.type.startsWith("video/");
      setIsVideo(fileIsVideo);
      // Notify parent component about file selection
      if (onFileSelect) {
        onFileSelect(file);
      }
      // Notify parent component if callback is provided
      if (onVideoChange) {
        onVideoChange(fileIsVideo);
      }
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Reset when file is cleared
      if (onFileSelect) {
        onFileSelect(null);
      }
      if (onVideoChange) {
        onVideoChange(false);
      }
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    onChange("");
    // Reset video status when removing
    if (onVideoChange) {
      onVideoChange(false);
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">{label}</label>
      <div className="space-y-2">
        <input
          type="file"
          id="file-upload"
          accept={accept}
          onChange={handleFileSelect}
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {selectedFile && previewUrl && (
          <div className="space-y-2">
            <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
              {selectedFile.type.startsWith("video/") ? (
                <video src={previewUrl} className="w-full h-full object-cover" controls />
              ) : (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="w-full px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Remove Selected File
            </button>
          </div>
        )}
        {value && !selectedFile && (
          <div className="space-y-2">
            <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
              {isVideo ? (
                <video src={value} className="w-full h-full object-cover" controls />
              ) : (
                <img src={value} alt="Current" className="w-full h-full object-cover" />
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="w-full px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
