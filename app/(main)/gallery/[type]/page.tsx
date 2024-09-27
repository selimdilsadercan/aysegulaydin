"use client";

import { useRef, useEffect, useState } from "react";
import Exit from "@/components/Exit";
import Item from "@/components/Item";
import { Nodes, Types } from "@/database.types";

export default function Page({ params }: { params: { type: Types } }) {
  const [filteredNodes, setFilteredNodes] = useState<Nodes[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const storedNodes = sessionStorage.getItem("nodesData");
    if (storedNodes) {
      const parsedData = JSON.parse(storedNodes) as Nodes[];
      setFilteredNodes(parsedData.filter((node) => node.type === params.type));
    }
  }, [params.type]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const updateDimensions = () => {
      setContentWidth(content.scrollWidth - window.innerWidth + 120);
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

    const timer = setTimeout(updateDimensions, 1000);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [contentWidth]);

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll">
      <div className="h-[400vh]">
        <div
          ref={contentRef}
          className="sticky top-0 flex h-screen transition-transform duration-300 ease-out items-center"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <div className="hidden md:flex flex-row items-center gap-[120px] px-[120px]">
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
    </div>
  );
}
