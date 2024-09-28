"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Exit from "@/components/Exit";
import Item from "@/components/Item";
import { Nodes, Types } from "@/database.types";
import { useRouter } from "next/navigation";

export default function Component({ params }: { params: { type: Types } }) {
  const router = useRouter();

  const [filteredNodes, setFilteredNodes] = useState<Nodes[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const storedNodes = sessionStorage.getItem("nodesData");
    if (!storedNodes) {
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(storedNodes) as Nodes[];
    setFilteredNodes(parsedData.filter((node) => node.type === params.type));
  }, [params.type, router]);

  const updateDimensions = useCallback(() => {
    const smallScreen = window.innerWidth < 768; // Adjust this breakpoint as needed
    setIsSmallScreen(smallScreen);

    if (!smallScreen && contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth - window.innerWidth + 120);
    } else {
      setContentWidth(0);
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isSmallScreen) return;

    const handleScroll = () => {
      const scrollPercentage = container.scrollTop / (container.scrollHeight - container.clientHeight);
      setTranslateX(-scrollPercentage * contentWidth);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [contentWidth, isSmallScreen]);

  return (
    <div ref={containerRef} className={`h-screen ${isSmallScreen ? "overflow-y-auto" : "overflow-y-scroll"}`}>
      {isSmallScreen ? (
        <div className="flex flex-col items-center gap-8 py-8 px-4">
          {filteredNodes &&
            filteredNodes.map((photo, index) => (
              <div className="flex h-fit w-fit transition-all" key={index}>
                <Item src={photo.image_url || ""} title={photo.name || ""} description={photo.description || ""} />
              </div>
            ))}
          <Exit text="Exit Gallery" width={80} />
        </div>
      ) : (
        <div className="h-[400vh]">
          <div
            ref={contentRef}
            className="sticky top-0 flex h-screen transition-transform duration-300 ease-out items-center"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            <div className="flex flex-row items-center gap-[120px] px-[120px]">
              {filteredNodes &&
                filteredNodes.map((photo, index) => (
                  <div className="flex h-fit w-fit transition-all" key={index}>
                    <Item src={photo.image_url || ""} title={photo.name || ""} description={photo.description || ""} />
                  </div>
                ))}
              <Exit text="Exit Gallery" width={80} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
