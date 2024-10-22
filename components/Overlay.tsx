import React, { useEffect, useRef, useState } from "react";

interface OverlayProps {
  src: string;
  isVideo: boolean;
  onClose: () => void;
  description: string;
  technical: string;
}

const Overlay: React.FC<OverlayProps> = ({ src, isVideo, onClose, description, technical }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: "100%", height: "100%" });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && contentRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const content = contentRef.current;

        // Set initial dimensions to fill the container
        content.style.width = "100%";
        content.style.height = "100%";

        // Get the natural size of the content
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        // Calculate the aspect ratio
        const aspectRatio = contentWidth / contentHeight;

        // Calculate padding based on screen size
        const padding = Math.min(clientWidth, clientHeight) * 0.1; // 10% of the smaller dimension

        let newWidth, newHeight;

        if ((clientWidth - padding * 2) / (clientHeight - padding * 2) > aspectRatio) {
          // Container is wider than content
          newHeight = clientHeight - padding * 2;
          newWidth = newHeight * aspectRatio;
        } else {
          // Container is taller than content
          newWidth = clientWidth - padding * 2;
          newHeight = newWidth / aspectRatio;
        }

        setDimensions({ width: `${newWidth}px`, height: `${newHeight}px` });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 lg:p-8" onClick={onClose}>
      <div
        ref={contentRef}
        className="relative flex flex-col"
        style={{ width: dimensions.width, maxWidth: "100%", maxHeight: "100%" }}
        onClick={handleContentClick}
      >
        <div className="relative" style={{ height: dimensions.height }}>
          {isVideo ? (
            <video src={src} autoPlay loop playsInline className="w-full h-full object-contain" />
          ) : (
            <img src={src} alt="Enlarged view" className="w-full h-full object-contain" />
          )}
          <button
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 touch-manipulation"
            onClick={onClose}
            aria-label="Close overlay"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-[13px] font-normal text-white truncate">{description}</p>
          <p className="text-[13px] font-normal text-white opacity-75 truncate">{technical}</p>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
