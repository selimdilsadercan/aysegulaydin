"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ExtendedNode, Node, ExtraNode, Type } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Exit from "@/components/Exit";
import Item from "@/components/Item";

export default function ExhibitionPage({ params }: { params: { type: Type; node_id: string } }) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<ExtendedNode | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNodeWidth, setSelectedNodeWidth] = useState<number>(0);
  const [extraNodeWidths, setExtraNodeWidths] = useState<number[]>([]);

  useEffect(() => {
    const storedNodes = sessionStorage.getItem("nodesData");
    if (!storedNodes) {
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(storedNodes) as ExtendedNode[];
    const selected = parsedData.find((node) => node.id === params.node_id);
    if (selected) {
      setSelectedNode(selected);
    } else {
      router.push("/");
    }
  }, [params.node_id, router]);

  const calculateNodeWidth = (node: Node): Promise<number> => {
    return new Promise((resolve) => {
      if (node.is_video) {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          const aspectRatio = video.videoWidth / video.videoHeight;
          const calculatedWidth = Math.round(240 * aspectRatio); // Assuming 240px height
          resolve(calculatedWidth);
        };
        video.src = node.image_url || "";
      } else {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const calculatedWidth = Math.round(240 * aspectRatio); // Assuming 240px height
          resolve(calculatedWidth);
        };
        img.src = node.image_url || "";
      }
    });
  };

  const calculateExtraNodeWidth = (): number => {
    // Assuming a fixed width for extra nodes, adjust as needed
    return 240;
  };

  useEffect(() => {
    const calculateWidths = async () => {
      if (selectedNode) {
        const selectedWidth = await calculateNodeWidth(selectedNode);
        setSelectedNodeWidth(selectedWidth);

        const extraWidths = selectedNode.nodes_extras.map(calculateExtraNodeWidth);
        setExtraNodeWidths(extraWidths);

        setIsLoading(false);
      }
    };

    calculateWidths();
  }, [selectedNode]);

  const updateDimensions = useCallback(() => {
    const smallScreen = window.innerWidth < 768; // Adjust this breakpoint as needed
    setIsSmallScreen(smallScreen);

    if (!smallScreen && contentRef.current && containerRef.current && selectedNode) {
      const containerWidth = containerRef.current.clientWidth;
      const gapWidth = 120; // Gap between items
      const exitButtonWidth = 80; // Width of the Exit button
      const totalItemsWidth = [selectedNodeWidth, ...extraNodeWidths].reduce((sum, width) => sum + width + gapWidth, 0) + exitButtonWidth + 2 * gapWidth; // Adding padding on both sides
      const newContentWidth = Math.max(0, totalItemsWidth - containerWidth);
      setContentWidth(newContentWidth);
    } else {
      setContentWidth(0);
    }

    // Reset translateX when dimensions update
    setTranslateX(0);
  }, [selectedNode, selectedNodeWidth, extraNodeWidths]);

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
    if (selectedNode && extraNodeWidths.length === selectedNode.nodes_extras.length) {
      updateDimensions();
    }
  }, [selectedNode, extraNodeWidths, updateDimensions]);

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
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`h-screen ${isSmallScreen ? "overflow-y-auto" : "overflow-y-scroll overflow-x-hidden"}`}>
      {isSmallScreen ? (
        <div className="flex flex-col items-center gap-8 py-8 px-4">
          {selectedNode && (
            <div className="flex h-fit w-fit transition-all">
              <Item
                isVideo={selectedNode.is_video || false}
                src={selectedNode.image_url || ""}
                title={selectedNode.name || ""}
                description={selectedNode.description || ""}
                id={selectedNode.id}
                type={params.type}
              />
            </div>
          )}
          {selectedNode &&
            selectedNode.nodes_extras.map((extraNode: ExtraNode, index: number) => (
              <div className="flex h-fit w-fit transition-all" key={extraNode.id}>
                <Item isVideo={false} src={extraNode.image_url || ""} description={extraNode.description || ""} type={params.type} />
              </div>
            ))}
          <Exit text="Exit Exhibition" width={80} />
        </div>
      ) : (
        <div className="h-[400vh]">
          <div
            ref={contentRef}
            className="sticky top-0 flex h-screen transition-transform duration-300 ease-out items-center"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            <div className="flex flex-row items-start gap-[120px] px-[120px]">
              {selectedNode && (
                <div className="flex h-fit w-fit transition-all" style={{ width: `${selectedNodeWidth}px` }}>
                  <Item
                    isVideo={selectedNode.is_video || false}
                    src={selectedNode.image_url || ""}
                    title={selectedNode.name || ""}
                    description={selectedNode.description || ""}
                    id={selectedNode.id}
                    type={params.type}
                  />
                </div>
              )}
              {selectedNode &&
                selectedNode.nodes_extras.map((extraNode: ExtraNode, index: number) => (
                  <div className="flex h-fit w-fit transition-all" key={extraNode.id} style={{ width: `${extraNodeWidths[index]}px` }}>
                    <Item isVideo={false} src={extraNode.image_url || ""} description={extraNode.description || ""} type={params.type} />
                  </div>
                ))}
              <Exit className="pt-10" text="Exit Exhibition" width={80} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
