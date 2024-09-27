"use client";

import Exit from "@/components/Exit";
import Item from "@/components/Item";
import ItemBig from "@/components/ItemBig";
import photos from "@/data/photos";
import { useRef, useEffect, useState } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const updateDimensions = () => {
      setContentWidth(content.scrollWidth - window.innerWidth);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const handleScroll = () => {
      if (container) {
        const scrollPercentage = container.scrollTop / (container.scrollHeight - container.clientHeight);
        setTranslateX(-scrollPercentage * contentWidth);
      }
    };

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
        setContentWidth(content.scrollWidth - window.innerWidth);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll">
      <div className="h-[400vh]">
        <div
          ref={contentRef}
          className="sticky top-0 flex h-screen transition-transform duration-300 ease-out items-center"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <div className="hidden md:flex flex-row items-center gap-[120px] px-[120px]">
            {photos.map((photo, index) => (
              <div className="group flex h-fit w-fit transition-all" key={index}>
                <Item className="block group-hover:hidden" key={index} src={photo.src} title={photo.title} description={photo.description} />
                <ItemBig className="hidden group-hover:block" key={index} src={photo.src} title={photo.title} description={photo.description} />
              </div>
            ))}
            <Exit text="Exit Exibition" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
