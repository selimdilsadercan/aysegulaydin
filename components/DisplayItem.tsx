"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  className?: string;
  src: string;
  title?: string;
  description: string;
  isVideo: boolean;
}

export default function DisplayItem({ className, src, title, description, isVideo }: Props) {
  const [dimensions, setDimensions] = useState({ width: 480, height: 270 });
  const [isLoaded, setIsLoaded] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateDimensions = (naturalWidth: number, naturalHeight: number) => {
    if (!containerRef.current) return;

    const viewportHeight = window.innerHeight;
    const maxHeight = Math.floor(viewportHeight * 0.9);
    const aspectRatio = naturalWidth / naturalHeight;

    let newWidth = 480;
    let newHeight = Math.round(newWidth / aspectRatio);

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = Math.round(newHeight * aspectRatio);
    }

    setDimensions({ width: newWidth, height: newHeight });
    setIsLoaded(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (mediaRef.current) {
        if (isVideo && mediaRef.current instanceof HTMLVideoElement) {
          calculateDimensions(mediaRef.current.videoWidth, mediaRef.current.videoHeight);
        } else if (!isVideo && mediaRef.current instanceof HTMLImageElement) {
          calculateDimensions(mediaRef.current.naturalWidth, mediaRef.current.naturalHeight);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVideo]);

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
    <div ref={containerRef} className={cn("flex flex-col lg:flex-row items-start lg:items-center justify-center gap-6 lg:gap-12", className)}>
      <div style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }} className="relative mx-auto lg:mx-0">
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            muted
            autoPlay
            loop
            playsInline
            className={cn("w-full h-full object-contain border-2 border-white shadow-xl", !isLoaded && "invisible")}
            onLoadedMetadata={() => setIsLoaded(true)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={src}
            alt={`An Image About ${title}`}
            layout="fill"
            objectFit="contain"
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
      <div className="p-4 text-white flex flex-col justify-center max-w-md">
        {title && <h2 className="text-[13px] font-normal text-primary mb-3 uppercase">{title}</h2>}
        <p className="text-[13px] font-normal text-secondary">{description}</p>
      </div>
    </div>
  );
}
