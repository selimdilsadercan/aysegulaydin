"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  className?: string;
  src: string;
  title?: string;
  isVideo: boolean;
}

export default function ExhibitionItem({ className, src, title, isVideo }: Props) {
  const [dimensions, setDimensions] = useState({ width: 320, height: 320 });
  const [isLoaded, setIsLoaded] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateDimensions = (naturalWidth: number, naturalHeight: number) => {
    const aspectRatio = naturalWidth / naturalHeight;
    const newWidth = Math.round(320 * aspectRatio);
    setDimensions({ width: newWidth, height: 320 });
    setIsLoaded(true);
  };

  useEffect(() => {
    setIsLoaded(false);
    if (isVideo && mediaRef.current instanceof HTMLVideoElement) {
      const videoElement = mediaRef.current;

      const handleLoadedMetadata = () => {
        calculateDimensions(videoElement.videoWidth, videoElement.videoHeight);
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.load(); // Force reload

      return () => {
        videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [isVideo, src]);

  return (
    <div ref={containerRef} className={cn("flex flex-col items-start justify-start", className)} style={{ width: `${dimensions.width}px` }}>
      <div className="relative" style={{ width: `${dimensions.width}px`, height: "320px" }}>
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            autoPlay
            loop
            playsInline
            muted
            className={cn("w-full h-full object-cover border-2 border-white shadow-xl", !isLoaded && "invisible")}
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement;
              calculateDimensions(video.videoWidth, video.videoHeight);
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={src}
            alt={`An Image About ${title}`}
            layout="fill"
            objectFit="cover"
            className={cn("border-2 border-white shadow-xl", !isLoaded && "invisible")}
            onLoadingComplete={({ naturalWidth, naturalHeight }) => calculateDimensions(naturalWidth, naturalHeight)}
          />
        )}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
