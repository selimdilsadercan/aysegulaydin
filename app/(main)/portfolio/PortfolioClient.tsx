"use client";

import AnimatedText from "@/components/AnimatedText";
import { ExtendedNode } from "@/types";

interface Props {
  nodes: ExtendedNode[];
}

export default function PortfolioClient({ nodes }: Props) {
  const getPortfolioItem = (type: string) => {
    const items = nodes.filter((item) => item.type == type).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    const videoItem = items.find((item) => item.is_video);
    const imageItem = items.find((item) => !item.is_video);
    return videoItem || imageItem;
  };

  return (
    <>
      {(() => {
        const selectedItem = getPortfolioItem("photo");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="PHOTOGRAPHY"
            href="/gallery/photo"
            variant="variant1"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("video");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="VIDEOGRAPHY"
            href="/gallery/video"
            variant="variant1"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("audio");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="AUDIO"
            variant="variant1"
            href="/gallery/audio"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("performance");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="PERFORMANCE"
            variant="variant1"
            href="/gallery/performance"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("installation");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="INSTALLATION"
            variant="variant1"
            href="/gallery/installation"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("drawing");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="DRAWING"
            href="/gallery/drawing"
            variant="variant1"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("oil");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="OIL PAINTING"
            variant="variant1"
            href="/gallery/oil"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("abstract");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="ABSTRACT PAINTING"
            href="/gallery/abstract"
            variant="variant1"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("digital");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="DIGITAL PAINTING"
            variant="variant1"
            href="/gallery/digital"
            nodes={nodes}
          />
        );
      })()}
      {(() => {
        const selectedItem = getPortfolioItem("sculpture");
        return (
          <AnimatedText
            image={selectedItem?.image_url || ""}
            isVideo={selectedItem?.is_video || false}
            title="SCULPTURE"
            variant="variant1"
            href="/gallery/sculpture"
            nodes={nodes}
            isSetNodes={true}
          />
        );
      })()}
      <AnimatedText title="HOME" variant="variant1" nodes={nodes} href="/home" />
    </>
  );
}
