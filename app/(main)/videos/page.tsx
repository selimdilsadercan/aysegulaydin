"use client";

import Exit from "@/components/Exit";
import settings from "@/data/settings";
import { useRef, useEffect, useState } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const updateDimensions = () => {
      const newContentWidth = content.scrollWidth - window.innerWidth;
      setContentWidth(Math.max(0, newContentWidth));
    };

    const handleScroll = () => {
      if (container) {
        const scrollPercentage = container.scrollTop / (container.scrollHeight - container.clientHeight);
        setTranslateX(-scrollPercentage * contentWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    container.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [contentWidth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const content = contentRef.current;
      if (content) {
        const newContentWidth = content.scrollWidth - window.innerWidth;
        setContentWidth(Math.max(0, newContentWidth));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll overflow-x-hidden">
      <div style={{ height: `${200}vh` }}>
        {" "}
        <div
          ref={contentRef}
          className="sticky top-0 flex h-screen transition-transform duration-300 ease-out items-center"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <div className="flex flex-row justify-start items-center p-[100px]">
            <div className="w-fit h-screen grid grid-cols-4 grid-rows-9 gap-3">
              {[...Array(8)].map((_, index) => (
                <video
                  key={index}
                  className={`w-[240px] h-full object-cover rounded-lg col-span-1 row-span-${settings.video_grid_layout[index]}`}
                  src="/dikey.mp4"
                  loop
                  muted
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
            <Exit text="Exit Exhibition" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
