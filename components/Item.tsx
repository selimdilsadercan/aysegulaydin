"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  className?: string;
  src: string;
  title: string;
  description: string;
}

export default function Item({ className, src, title, description }: Props) {
  const [imageDimensions, setImageDimensions] = useState({ width: 240, height: 240 });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageLoad = (naturalWidth: number, naturalHeight: number) => {
    const aspectRatio = naturalWidth / naturalHeight;
    if (isSmallScreen) {
      const fixedWidth = 240; // You can adjust this value
      setImageDimensions({ width: fixedWidth, height: fixedWidth / aspectRatio });
    } else {
      const fixedHeight = 240;
      setImageDimensions({ width: fixedHeight * aspectRatio, height: fixedHeight });
    }
  };

  return (
    <div className={cn("flex flex-col justify-start items-start", className)}>
      <div
        className={cn("relative mb-2 md:mb-6", isSmallScreen ? "w-60 h-auto" : "w-auto h-60")}
        style={{
          width: isSmallScreen ? "240px" : `${imageDimensions.width}px`,
          height: isSmallScreen ? `${imageDimensions.height}px` : "240px"
        }}
      >
        <Image
          src={src}
          alt={`An Image About ${title}`}
          className="object-cover border-2 border-white shadow-xl"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoadingComplete={({ naturalWidth, naturalHeight }) => handleImageLoad(naturalWidth, naturalHeight)}
        />
      </div>
      <div
        className={cn("flex flex-col justify-start items-start overflow-hidden", isSmallScreen ? "gap-1 pl-0" : "gap-4 pl-1")}
        style={{ width: `${imageDimensions.width}px` }}
      >
        <p className="w-full overflow-visible font-normal text-primary text-sm text-start uppercase">{title}</p>
        <p className="w-full line-clamp-3 font-normal text-secondary text-sm text-start">{description}</p>
      </div>
    </div>
  );
}
