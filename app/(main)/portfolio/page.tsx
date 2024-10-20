import AnimatedText from "@/components/AnimatedText";
import { createClient } from "@/lib/db";
import Image from "next/image";
import staticSettings from "@/data/settings";

async function Page() {
  const db = createClient();

  const { data: settingsData } = await db.from("setttings").select();
  if (!settingsData || (settingsData && settingsData.length == 0)) return null;
  const settings = settingsData[0];

  const { data: nodesData } = await db.from("nodes").select(`*, nodes_extras(*)`);
  if (!nodesData || (nodesData && nodesData.length == 0)) return null;

  return (
    <div className="h-full flex flex-row justify-center items-center bg-background">
      <Image className="w-full h-[70%] mt-12 opacity-75 object-contain hidden lg:block" src={staticSettings.signature || ""} alt="" width={100} height={200} />
      <div className="w-full h-fit flex flex-col justify-center items-start gap-0 p-12">
        <AnimatedText
          image={
            nodesData
              .filter((item) => item.is_recent && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="RECENT WORKS"
          variant="variant1"
          href="/gallery/recent"
          nodes={nodesData}
        />
        <AnimatedText
          image={
            nodesData
              .filter((item) => item.type == "photo" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="PHOTO/VIDEO/AUDIO"
          variant="variant4"
          nodes={nodesData}
        />
        <AnimatedText
          image={
            nodesData
              .filter((item) => item.type == "installation" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="PERFORMANCE/INSTALLATION"
          variant="variant6"
          nodes={nodesData}
        />
        <AnimatedText
          image={
            nodesData
              .filter((item) => item.type == "abstract" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="PAINTING"
          variant="variant5"
          nodes={nodesData}
        />
        <AnimatedText
          image={
            nodesData
              .filter((item) => item.type == "sculpture" && !item.is_video)
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
              .at(0)?.image_url || ""
          }
          title="SCULPTURE"
          variant="variant1"
          href="/gallery/sculpture"
          nodes={nodesData}
          isSetNodes={true}
        />
        <AnimatedText title="CONTACT" variant="variant2" settings={settings} />
      </div>
    </div>
  );
}

export default Page;
