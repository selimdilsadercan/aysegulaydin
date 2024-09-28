import AnimatedText from "@/components/AnimatedText";
import { createClient } from "@/lib/db";
import Image from "next/image";

async function Page() {
  const db = createClient();

  const { data: settingsData } = await db.from("setttings").select();
  if (!settingsData || (settingsData && settingsData.length == 0)) return null;
  const settings = settingsData[0];

  const { data: nodesData } = await db.from("nodes").select(`*, nodes_extras(*)`);
  if (!nodesData || (nodesData && nodesData.length == 0)) return null;

  return (
    <div className="h-full flex flex-row justify-center items-center bg-background">
      <Image className="w-full h-full opacity-75 object-contain hidden lg:block" src={settings.main_page_image_url || ""} alt="" width={100} height={200} />
      <div className="w-full h-fit flex flex-col justify-center items-start gap-0 p-12">
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="RECENT WORKS"
          variant="variant1"
          href="/gallery/recent"
          nodes={nodesData}
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="PHOTO/VIDEO/AUDIO"
          variant="variant4"
          nodes={nodesData}
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="PERFORMANCE/INSTALLATIONS"
          variant="variant6"
          nodes={nodesData}
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="PAINTINGS"
          variant="variant5"
          nodes={nodesData}
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="SCULPTURE"
          variant="variant1"
          href="/gallery/sculpture"
          nodes={nodesData}
          isSetNodes={true}
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="STATEMENT"
          href="/statement"
          variant="variant1"
          settings={settings}
        />
        <AnimatedText title="CONTACT" variant="variant2" settings={settings} />
        <AnimatedText title="LANGUAGE" variant="variant3" />
      </div>
    </div>
  );
}

export default Page;
