"use client";

import React, { useEffect, useState, useRef } from "react";
import { Node, Type } from "@/types";
import { useRouter } from "next/navigation";
import Exit from "@/components/Exit";
import Item from "@/components/Item";

export default function Component({ params }: { params: { type: Type } }) {
  const router = useRouter();
  const [filteredNodes, setFilteredNodes] = useState<Node[] | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setIsLoading(false);
  }, [params.type, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isSmallScreen) return;
    const element = containerRef.current;
    if (element) {
      if (e.deltaY === 0) return;
      e.preventDefault();

      // Increase the scroll speed by multiplying deltaY
      const scrollSpeed = 1; // Adjust this value to increase or decrease scroll speed
      element.scrollBy({
        left: e.deltaY * scrollSpeed,
        behavior: "auto" // Changed from 'smooth' to 'auto' for faster response
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-l font-normal text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} onWheel={onWheel} className={`h-screen ${isSmallScreen ? "overflow-y-auto" : "overflow-x-auto overflow-y-hidden"}`}>
      <div className={`flex ${isSmallScreen ? "flex-col items-center gap-8 py-8 px-4 w-full" : "h-screen items-center"}`}>
        <div className={`flex ${isSmallScreen ? "flex-col w-full" : "flex-row"} gap-[120px] ${isSmallScreen ? "" : "px-[120px]"}`}>
          {filteredNodes &&
            filteredNodes.map((node) => (
              <div className={`flex ${isSmallScreen ? "w-full" : ""}`} key={node.id}>
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
          <Exit className={isSmallScreen ? "h-full w-full flex justify-center" : "pb-16 "} text="Exit Gallery" width={120} />
        </div>
      </div>
    </div>
  );
}
