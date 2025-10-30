"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";
import { Type } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  className?: string;
  src: string;
  title?: string;
  description: string;
  isVideo: boolean;
  id?: string;
  type?: Type;
}

export default function Component({ className, src, title, description, isVideo, id, type }: Props) {
  const [dimensions, setDimensions] = useState({ width: 320, height: 320 });
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Global sound state - read from localStorage, default to false (muted)
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("videoSoundEnabled");
      return saved === "true";
    }
    return false;
  });

  // Listen for sound state changes from other components
  useEffect(() => {
    const handleSoundStateChange = () => {
      const saved = localStorage.getItem("videoSoundEnabled");
      setIsSoundEnabled(saved === "true");
    };

    // Listen to storage events (cross-tab)
    window.addEventListener("storage", handleSoundStateChange);

    // Listen to custom event (same-page)
    window.addEventListener("videoSoundToggle", handleSoundStateChange);

    return () => {
      window.removeEventListener("storage", handleSoundStateChange);
      window.removeEventListener("videoSoundToggle", handleSoundStateChange);
    };
  }, []);

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
      const fixedWidth = 320;
      setDimensions({ width: fixedWidth, height: fixedWidth / aspectRatio });
    } else {
      const fixedHeight = 320;
      setDimensions({ width: fixedHeight * aspectRatio, height: fixedHeight });
    }
    setIsLoaded(true);
  };

  // Update video mute state based on global sound setting and hover state
  useEffect(() => {
    if (isVideo && videoRef.current) {
      // Mute if sound is disabled globally OR if not hovered (and sound is enabled)
      videoRef.current.muted = !isSoundEnabled || !isHovered;
    }
  }, [isVideo, isSoundEnabled, isHovered]);

  useEffect(() => {
    setIsLoaded(false);
    if (isVideo && videoRef.current) {
      // Ensure video is muted based on global setting
      videoRef.current.muted = !isSoundEnabled;
      videoRef.current.addEventListener("loadedmetadata", () => {
        const video = videoRef.current;
        if (video) {
          // Apply global sound setting after metadata loads
          video.muted = !isSoundEnabled || !isHovered;
          handleMediaLoad(video.videoWidth, video.videoHeight);
        }
      });
    }
  }, [isVideo, src]);

  const handleClick = () => {
    if (id) {
      router.push(`/gallery/${type}/${id}`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isVideo && videoRef.current) {
      // Unmute only if sound is enabled globally
      videoRef.current.muted = !isSoundEnabled;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isVideo && videoRef.current) {
      // Always mute when leaving hover
      videoRef.current.muted = true;
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the icon
    const newSoundState = !isSoundEnabled;
    setIsSoundEnabled(newSoundState);
    localStorage.setItem("videoSoundEnabled", String(newSoundState));

    // Dispatch custom event to sync all components on the same page
    window.dispatchEvent(new CustomEvent("videoSoundToggle"));

    // Update current video's mute state immediately
    if (isVideo && videoRef.current) {
      videoRef.current.muted = !newSoundState || !isHovered;
    }

    // Broadcast the change to all video elements in the page
    const allVideos = document.querySelectorAll("video");
    allVideos.forEach((video) => {
      const itemElement = video.closest("[data-video-item]");
      const isHovered = itemElement?.matches(":hover");
      video.muted = !newSoundState || !isHovered;
    });
  };

  const preventDownload = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={cn("flex flex-col justify-start items-center cursor-pointer w-full mx-auto", className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={preventDownload}
      data-video-item={isVideo ? "true" : undefined}
    >
      <div
        className={cn("relative mb-2 md:mb-6", isSmallScreen ? "w-full h-auto" : "w-auto h-60")}
        style={{
          width: isSmallScreen ? "100%" : `${dimensions.width}px`,
          height: isSmallScreen ? `${dimensions.height}px` : "320px"
        }}
      >
        {isVideo ? (
          <div style={{ width: isSmallScreen ? "100%" : `${dimensions.width}px`, height: isSmallScreen ? `${dimensions.height}px` : "320px" }}>
            <video
              ref={videoRef}
              src={src}
              autoPlay
              loop
              muted
              playsInline
              controlsList="nodownload"
              onContextMenu={preventDownload}
              className={cn(
                "object-cover border-2 border-white shadow-xl w-full h-full transition-all duration-300",
                !isHovered && "grayscale",
                !isLoaded && "invisible"
              )}
              preload="metadata"
              onLoadedMetadata={(e) => {
                const video = e.target as HTMLVideoElement;
                // Ensure video is muted when metadata loads
                video.muted = true;
                handleMediaLoad(video.videoWidth, video.videoHeight);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div
            className="relative"
            style={{ width: isSmallScreen ? "100%" : `${dimensions.width}px`, height: isSmallScreen ? `${dimensions.height}px` : "320px" }}
          >
            <Image
              src={src}
              alt={`An Image About ${title}`}
              className={cn("object-cover border-2 border-white shadow-xl transition-all duration-300", !isHovered && "grayscale", !isLoaded && "invisible")}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoadingComplete={({ naturalWidth, naturalHeight }) => handleMediaLoad(naturalWidth, naturalHeight)}
              onContextMenu={preventDownload}
              draggable={false}
              style={{ pointerEvents: "none" }}
            />
          </div>
        )}
        {!isLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-200"
            style={{
              width: isSmallScreen ? "100%" : `${dimensions.width}px`,
              height: isSmallScreen ? `${dimensions.height}px` : "320px"
            }}
          >
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
        {isVideo && isHovered && (
          <button
            onClick={toggleSound}
            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 z-10"
            aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
          >
            {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        )}
      </div>
      <div className={cn("flex flex-col justify-start items-start overflow-hidden w-full", isSmallScreen ? "gap-1" : "gap-4")}>
        <p className="w-full overflow-visible font-normal text-primary text-sm uppercase">{title}</p>
        <p className="w-full line-clamp-2 font-normal text-justify text-secondary text-sm">{description}</p>
      </div>
    </div>
  );
}
