"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Node, Type } from "@/types";
import { useRouter } from "next/navigation";
import Exit from "@/components/Exit";
import Item from "@/components/Item";

export default function Page({ params }: { params: { type: Type } }) {
  const router = useRouter();

  const [filteredNodes, setFilteredNodes] = useState<Node[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemWidths, setItemWidths] = useState<number[]>([]);

  useEffect(() => {
    const storedNodes = sessionStorage.getItem("nodesData");
    if (!storedNodes) {
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(storedNodes) as Node[];
    const filtered = params.type === "recent" ? parsedData.filter((node) => node.is_recent) : parsedData.filter((node) => node.type === params.type);

    const sortedNodes = filtered.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    setFilteredNodes(sortedNodes);
  }, [params.type, router]);

  const calculateItemWidth = (node: Node): Promise<number> => {
    return new Promise((resolve) => {
      if (node.is_video) {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          const aspectRatio = video.videoWidth / video.videoHeight;
          const calculatedWidth = Math.round(320 * aspectRatio); // Assuming 320px height
          resolve(calculatedWidth);
        };
        video.src = node.image_url || "";
      } else {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const calculatedWidth = Math.round(320 * aspectRatio); // Assuming 320px height
          resolve(calculatedWidth);
        };
        img.src = node.image_url || "";
      }
    });
  };

  useEffect(() => {
    const calculateWidths = async () => {
      if (filteredNodes) {
        const widths = await Promise.all(filteredNodes.map((node) => calculateItemWidth(node)));
        setItemWidths(widths);
        setIsLoading(false);
      }
    };

    calculateWidths();
  }, [filteredNodes]);

  const updateDimensions = useCallback(() => {
    const smallScreen = window.innerWidth < 768; // Adjust this breakpoint as needed
    setIsSmallScreen(smallScreen);

    if (!smallScreen && contentRef.current && containerRef.current && filteredNodes) {
      const containerWidth = containerRef.current.clientWidth;
      const gapWidth = 120; // Gap between items
      const exitButtonWidth = 80; // Width of the Exit button
      const totalItemsWidth = itemWidths.reduce((sum, width) => sum + width + gapWidth, 0) + exitButtonWidth + 2 * gapWidth; // Adding padding on both sides
      const newContentWidth = Math.max(0, totalItemsWidth - containerWidth);
      setContentWidth(newContentWidth);
    } else {
      setContentWidth(0);
    }

    // Reset translateX when dimensions update
    setTranslateX(0);
  }, [filteredNodes, itemWidths]);

  useEffect(() => {
    const handleResize = () => {
      updateDimensions();
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (filteredNodes && itemWidths.length === filteredNodes.length) {
      updateDimensions();
    }
  }, [filteredNodes, itemWidths, updateDimensions]);

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-l font-normal text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`h-screen ${isSmallScreen ? "overflow-y-auto" : "overflow-y-scroll overflow-x-hidden"}`}>
      {isSmallScreen ? (
        <div className="flex flex-col items-center gap-8 py-8 px-4 w-full">
          {filteredNodes &&
            filteredNodes.map((node, index) => (
              <div className="flex justify-center w-full transition-all" key={index}>
                <Item
                  id={node.id}
                  type={params.type}
                  isVideo={node.is_video || false}
                  src={node.image_url || ""}
                  title={node.name || ""}
                  description={node.description || ""}
                />
              </div>
            ))}
          <div className="flex justify-center w-full">
            <Exit text="Exit Gallery" width={80} />
          </div>
        </div>
      ) : (
        <div className="h-[400vh]">
          <div
            ref={contentRef}
            className="sticky top-0 flex h-screen transition-transform duration-300 ease-out items-center"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            <div className="flex flex-row items-start gap-[120px] px-[120px]">
              {filteredNodes &&
                filteredNodes.map((node, index) => (
                  <div className="flex h-fit w-fit" key={index} style={{ width: `${itemWidths[index]}px` }}>
                    <Item
                      id={node.id}
                      type={params.type}
                      isVideo={node.is_video || false}
                      src={node.image_url || ""}
                      title={node.name || ""}
                      description={node.description || ""}
                    />
                  </div>
                ))}
              <Exit className="pt-16" text="Exit Gallery" width={80} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
