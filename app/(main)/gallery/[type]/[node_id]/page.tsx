"use client";

import DisplayItem from "@/components/DisplayItem";
import ExhibitionItem from "@/components/ExhibitionItem";
import { ExtendedNode } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { type: string; node_id: string } }) {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<ExtendedNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-l font-normal text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!selectedNode) {
    router.push("/");
    return;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen justify-start items-center gap-8 md:gap-16 p-4 md:p-8 lg:p-16">
      <div className="w-full md:w-auto">
        <DisplayItem
          technical={selectedNode.technical || ""}
          title={selectedNode.name || ""}
          src={selectedNode.image_url || ""}
          isVideo={selectedNode.is_video || false}
          description={selectedNode.description || ""}
        />
      </div>

      <div className="">
        <p className="ml-1 mb-4">Exhition →</p>
        <div className="flex flex-row items-start justify-center gap-1">
          {selectedNode.nodes_extras.map((extraNode) => (
            <ExhibitionItem src={extraNode.image_url || ""} isVideo={extraNode.is_video || false} />
          ))}
        </div>
      </div>
    </div>
  );
}
