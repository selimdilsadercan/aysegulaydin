import { createClient } from "@/lib/db";
import Image from "next/image";
import staticSettings from "@/data/settings";
import AnimatedText from "@/components/AnimatedText";

async function Page() {
  const db = createClient();

  const { data: nodes } = await db.from("nodes").select(`*, nodes_extras(*)`);
  if (!nodes || (nodes && nodes.length == 0)) return null;

  return (
    <div className="h-full flex flex-row justify-center items-center bg-background relative">
      <div className="absolute inset-0 lg:hidden">
        <Image className="w-full h-full object-contain opacity-20" src={staticSettings.signature || ""} alt="Background signature" layout="fill" />
      </div>
      <div className="relative w-full h-[70%] hidden lg:block">
        <Image className="object-contain hidden lg:block" src={staticSettings.signature || ""} alt="Background signature" layout="fill" />
      </div>
      <div className="w-full h-fit flex flex-col justify-center items-start gap-0 p-4 md:p-12 relative z-10">
        {(() => {
          const photoItems = nodes.filter((item) => item.type == "photo").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = photoItems.find((item) => item.is_video);
          const imageItem = photoItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const videoItems = nodes.filter((item) => item.type == "video").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = videoItems.find((item) => item.is_video);
          const imageItem = videoItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const audioItems = nodes.filter((item) => item.type == "audio").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = audioItems.find((item) => item.is_video);
          const imageItem = audioItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const performanceItems = nodes.filter((item) => item.type == "performance").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = performanceItems.find((item) => item.is_video);
          const imageItem = performanceItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const installationItems = nodes.filter((item) => item.type == "installation").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = installationItems.find((item) => item.is_video);
          const imageItem = installationItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const drawingItems = nodes.filter((item) => item.type == "drawing").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = drawingItems.find((item) => item.is_video);
          const imageItem = drawingItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const oilItems = nodes.filter((item) => item.type == "oil").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = oilItems.find((item) => item.is_video);
          const imageItem = oilItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const abstractItems = nodes.filter((item) => item.type == "abstract").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = abstractItems.find((item) => item.is_video);
          const imageItem = abstractItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const digitalItems = nodes.filter((item) => item.type == "digital").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = digitalItems.find((item) => item.is_video);
          const imageItem = digitalItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
          const sculptureItems = nodes.filter((item) => item.type == "sculpture").sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          const videoItem = sculptureItems.find((item) => item.is_video);
          const imageItem = sculptureItems.find((item) => !item.is_video);
          const selectedItem = videoItem || imageItem;
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
      </div>
    </div>
  );
}

export default Page;
