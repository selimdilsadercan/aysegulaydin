"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Exit from "@/components/Exit";
import DisplayItem from "@/components/DisplayItem";
import ExhibitionItem from "@/components/ExhibitionItem";
import { ExtendedNode, ExtraNode } from "@/types";

interface OverlayProps {
  src: string;
  isVideo: boolean;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ src, isVideo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="max-w-4xl max-h-full p-4">
        {isVideo ? (
          <video src={src} autoPlay loop playsInline muted className="max-w-full max-h-full object-contain" />
        ) : (
          <img src={src} alt="Enlarged view" className="max-w-full max-h-full object-contain" />
        )}
      </div>
    </div>
  );
};

export default function Page({ params }: { params: { node_id: string } }) {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<ExtendedNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [overlayItem, setOverlayItem] = useState<{ src: string; isVideo: boolean } | null>(null);

  useEffect(() => {
    const fetchNodeData = async () => {
      setIsLoading(true);
      const storedNodes = sessionStorage.getItem("nodesData");
      if (!storedNodes) {
        router.push("/");
        return;
      }

      const nodes: ExtendedNode[] = JSON.parse(storedNodes);

      const foundNode = nodes.find((node) => node.id === params.node_id);
      if (!foundNode) {
        router.push("/");
        return;
      }

      setSelectedNode(foundNode);
      setIsLoading(false);
    };

    fetchNodeData();
  }, [params.node_id, router]);

  const calculateItemWidth = (node: ExtendedNode | ExtraNode, isMainNode: boolean): Promise<number> => {
    return new Promise((resolve) => {
      if (node.is_video) {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          const aspectRatio = video.videoWidth / video.videoHeight;
          const calculatedWidth = Math.round((isMainNode ? 720 : 320) * aspectRatio);
          resolve(calculatedWidth);
        };
        video.src = node.image_url || "";
      } else {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const calculatedWidth = Math.round((isMainNode ? 720 : 320) * aspectRatio);
          resolve(calculatedWidth);
        };
        img.src = node.image_url || "";
      }
    });
  };

  useEffect(() => {
    const calculateWidths = async () => {
      if (selectedNode) {
        const mainNodeWidth = (await calculateItemWidth(selectedNode, true)) + 360;
        const extraNodesWidths = await Promise.all(selectedNode.nodes_extras.map((node) => calculateItemWidth(node, false)));
        setItemWidths([mainNodeWidth, ...extraNodesWidths]);
      }
    };

    calculateWidths();
  }, [selectedNode]);

  const updateDimensions = useCallback(() => {
    const smallScreen = window.innerWidth < 768;
    setIsSmallScreen(smallScreen);

    if (!smallScreen && contentRef.current && containerRef.current && selectedNode) {
      const containerWidth = containerRef.current.clientWidth;
      const gapWidth = 3;
      const exitButtonWidth = 160;
      const totalItemsWidth = itemWidths.reduce((sum, width) => sum + width + gapWidth, 0) + exitButtonWidth + 2 * gapWidth + 20;
      const newContentWidth = Math.max(0, totalItemsWidth - containerWidth);
      setContentWidth(newContentWidth);
    } else {
      setContentWidth(0);
    }

    setTranslateX(0);
  }, [selectedNode, itemWidths]);

  useEffect(() => {
    const handleResize = () => {
      updateDimensions();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (selectedNode && itemWidths.length > 0) {
      updateDimensions();
    }
  }, [selectedNode, itemWidths, updateDimensions]);

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

  const handleItemClick = (src: string, isVideo: boolean) => {
    setOverlayItem({ src, isVideo });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-l font-normal text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!selectedNode) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-l font-normal text-gray-700">Node not found</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`h-screen ${isSmallScreen ? "overflow-y-auto" : "overflow-y-scroll overflow-x-hidden"}`}>
      {isSmallScreen ? (
        <div className="flex flex-col items-center gap-[3px] py-8 px-4">
          <DisplayItem
            src={selectedNode.image_url || ""}
            title={selectedNode.name || ""}
            description={selectedNode.description || ""}
            technical={selectedNode.technical || ""}
            isVideo={selectedNode.is_video || false}
          />
          {selectedNode.nodes_extras.map((node) => (
            <ExhibitionItem
              key={node.id}
              src={node.image_url || ""}
              title={node.description || ""}
              isVideo={node.is_video || false}
              onClick={() => handleItemClick(node.image_url || "", node.is_video || false)}
            />
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
            <div className="flex flex-row items-center gap-[3px] pl-[20px] pr-[3px] mr-10">
              <div className="flex h-fit w-fit" style={{ width: `${itemWidths[0]}px` }}>
                <DisplayItem
                  src={selectedNode.image_url || ""}
                  title={selectedNode.name || ""}
                  description={selectedNode.description || ""}
                  technical={selectedNode.technical || ""}
                  isVideo={selectedNode.is_video || false}
                />
              </div>
              {selectedNode.nodes_extras.map((node, index) => (
                <div className="flex h-fit w-fit" key={node.id} style={{ width: `${itemWidths[index + 1]}px` }}>
                  <ExhibitionItem
                    src={node.image_url || ""}
                    title={node.description || ""}
                    isVideo={node.is_video || false}
                    onClick={() => handleItemClick(node.image_url || "", node.is_video || false)}
                  />
                </div>
              ))}
              <Exit className="ml-10 pt-10" text="Exit Exhibition" width={80} />
            </div>
          </div>
        </div>
      )}
      {overlayItem && <Overlay src={overlayItem.src} isVideo={overlayItem.isVideo} onClose={() => setOverlayItem(null)} />}
    </div>
  );
}
