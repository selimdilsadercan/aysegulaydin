"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Exit from "@/components/Exit";
import DisplayItem from "@/components/DisplayItem";
import ExhibitionItem from "@/components/ExhibitionItem";
import { ExtendedNode } from "@/types";
import Overlay from "@/components/Overlay";

export default function Page({ params }: { params: { node_id: string } }) {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<ExtendedNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [overlayItem, setOverlayItem] = useState<{ src: string; isVideo: boolean; description: string; technical: string; youtubeUrl: string } | null>(null);

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

      // Sort nodes_extras by index
      foundNode.nodes_extras.sort((a, b) => (a.index || 0) - (b.index || 0));

      setSelectedNode(foundNode);
      setIsLoading(false);
    };

    fetchNodeData();
  }, [params.node_id, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleItemClick = (src: string, isVideo: boolean, description: string, technical: string, youtubeUrl: string) => {
    setOverlayItem({ src, isVideo, description, technical, youtubeUrl });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isSmallScreen) return;
    const element = containerRef.current;
    if (element) {
      if (e.deltaY === 0) return;
      e.preventDefault();

      const scrollSpeed = 1;
      element.scrollBy({
        left: e.deltaY * scrollSpeed,
        behavior: "auto"
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

  if (!selectedNode) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-l font-normal text-gray-700">Node not found</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} onWheel={onWheel} className={`h-screen ${isSmallScreen ? "overflow-y-auto" : "overflow-x-auto overflow-y-hidden"}`}>
      <div className={`flex ${isSmallScreen ? "flex-col items-center" : "h-screen items-center"}`}>
        <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} items-center gap-[3px] ${isSmallScreen ? "py-6" : "px-[20px]"}`}>
          <div className={`flex ${isSmallScreen ? "w-full" : "h-fit w-fit"}`}>
            <DisplayItem
              src={selectedNode.image_url || ""}
              title={selectedNode.name || ""}
              description={selectedNode.description || ""}
              technical={selectedNode.technical || ""}
              isVideo={selectedNode.is_video || false}
              youtubeUrl={selectedNode.youtube_link || ""}
              onClick={() =>
                handleItemClick(
                  selectedNode.image_url || "",
                  selectedNode.is_video || false,
                  selectedNode.description || "",
                  selectedNode.technical || "",
                  selectedNode.youtube_link || ""
                )
              }
            />
          </div>
          {selectedNode.nodes_extras.map((node) => (
            <div className={`flex ${isSmallScreen ? "" : "h-fit w-fit"}`} key={node.id}>
              <ExhibitionItem
                src={node.image_url || ""}
                title={node.description || ""}
                isVideo={node.is_video || false}
                onClick={() =>
                  handleItemClick(node.image_url || "", node.is_video || false, node.description || "", node.technical || "", node.youtube_url || "")
                }
              />
            </div>
          ))}
          <Exit className={isSmallScreen ? "w-full flex justify-center mt-8" : "self-center mx-10 pt-8"} text="Exit Exhibition" width={80} />
        </div>
      </div>
      {overlayItem && (
        <Overlay
          src={overlayItem.src}
          isVideo={overlayItem.isVideo}
          onClose={() => setOverlayItem(null)}
          youtubeUrl={overlayItem.youtubeUrl}
          description={overlayItem.description || ""}
          technical={overlayItem.technical || ""}
        />
      )}
    </div>
  );
}
