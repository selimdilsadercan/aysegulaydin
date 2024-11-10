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
        <Image className="object-contain opacity-75 hidden lg:block" src={staticSettings.signature || ""} alt="Background signature" layout="fill" />
      </div>
      <div className="w-full h-fit flex flex-col justify-center items-start gap-0 p-4 md:p-12 relative z-10">
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "photo" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="PHOTOGRAHY"
          href="/gallery/photo"
          variant="variant1"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "video" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="VIDEOGRAHY"
          href="/gallery/video"
          variant="variant1"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "audio" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="AUDIO"
          variant="variant1"
          href="/gallery/audio"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "performance" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="PERFORMANCE"
          variant="variant1"
          href="/gallery/performance"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "installation" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="INSTALLATION"
          variant="variant1"
          href="/gallery/installation"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "drawing" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="DRAWING"
          href="/gallery/drawing"
          variant="variant1"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "oil" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="OIL PAINTING"
          variant="variant1"
          href="/gallery/oil"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "abstract" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="ABSTRACT PAINTING"
          href="/gallery/abstract"
          variant="variant1"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "digital" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="DIGITAL PAINTING"
          variant="variant1"
          href="/gallery/digital"
          nodes={nodes}
        />
        <AnimatedText
          image={
            nodes
              .filter((item) => item.type == "sculpture" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="SCULPTURE"
          variant="variant1"
          href="/gallery/sculpture"
          nodes={nodes}
          isSetNodes={true}
        />
        <AnimatedText title="HOME" variant="variant1" nodes={nodes} href="/home" />
      </div>
    </div>
  );
}

export default Page;
