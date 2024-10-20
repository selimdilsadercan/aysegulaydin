'use client'

import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface Props {
  className?: string
  src: string
  title: string
  isVideo: boolean
  onClick: () => void
}

export default function ExhibitionItem({ className, src, title, isVideo, onClick }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null)

  useEffect(() => {
    setIsLoaded(false)

    if (isVideo && mediaRef.current instanceof HTMLVideoElement) {
      const videoElement = mediaRef.current
      videoElement.muted = true

      const handleLoadedMetadata = () => {
        setIsLoaded(true)
      }

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
      videoElement.load() // Force reload

      return () => {
        videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      }
    }
  }, [isVideo, src])

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start cursor-pointer",
        "group", // Add group class for hover effects
        className
      )}
      style={{ width: '200px', height: '200px' }}
      onClick={onClick}
    >
      <div className="relative w-full h-full overflow-hidden">
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            autoPlay
            loop
            playsInline
            className={cn(
              "w-full h-full object-cover border-2 border-white shadow-xl",
              "transition-all duration-300 ease-in-out",
              "filter grayscale group-hover:filter-none", // Add monochrome effect and remove on hover
              !isLoaded && "invisible"
            )}
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
            objectFit="cover"
            className={cn(
              "border-2 border-white shadow-xl",
              "transition-all duration-300 ease-in-out",
              "filter grayscale group-hover:filter-none", // Add monochrome effect and remove on hover
              !isLoaded && "invisible"
            )}
            onLoadingComplete={() => setIsLoaded(true)}
          />
        )}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
      </div>
    </div>
  )
}