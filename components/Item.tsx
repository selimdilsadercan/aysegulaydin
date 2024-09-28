"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  className?: string;
  src: string;
  title: string;
  description: string;
  isVideo: boolean;
}

export default function Item({ className, src, title, description, isVideo }: Props) {
  const [dimensions, setDimensions] = useState({ width: 240, height: 240 });
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMediaLoad = (naturalWidth: number, naturalHeight: number) => {
    const aspectRatio = naturalWidth / naturalHeight;
    if (isSmallScreen) {
      const fixedWidth = 240;
      setDimensions({ width: fixedWidth, height: fixedWidth / aspectRatio });
    } else {
      const fixedHeight = 240;
      setDimensions({ width: fixedHeight * aspectRatio, height: fixedHeight });
    }
  };

  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        const video = videoRef.current;
        if (video) {
          handleMediaLoad(video.videoWidth, video.videoHeight);
        }
      });
    }
  }, [isVideo]);

  return (
    <div className={cn("flex flex-col justify-start items-start", className)}>
      <div
        className={cn("relative mb-2 md:mb-6", isSmallScreen ? "w-60 h-auto" : "w-auto h-60")}
        style={{
          width: isSmallScreen ? "240px" : `${dimensions.width}px`,
          height: isSmallScreen ? `${dimensions.height}px` : "240px"
        }}
      >
        {isVideo ? (
          <video ref={videoRef} src={src} muted autoPlay className="object-cover border-2 border-white shadow-xl w-full h-full" preload="metadata">
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={src}
            alt={`An Image About ${title}`}
            className="object-cover border-2 border-white shadow-xl"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoadingComplete={({ naturalWidth, naturalHeight }) => handleMediaLoad(naturalWidth, naturalHeight)}
          />
        )}
      </div>
      <div
        className={cn("flex flex-col justify-start items-start overflow-hidden", isSmallScreen ? "gap-1 pl-0" : "gap-4 pl-1")}
        style={{ width: `${dimensions.width}px` }}
      >
        <p className="w-full overflow-visible font-normal text-primary text-sm text-start uppercase">{title}</p>
        <p className="w-full line-clamp-3 font-normal text-secondary text-sm text-start">{description}</p>
      </div>
    </div>
  );
}
