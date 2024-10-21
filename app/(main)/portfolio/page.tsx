import AnimatedText from "@/components/AnimatedText";
import { createClient } from "@/lib/db";
import Image from "next/image";
import staticSettings from "@/data/settings";
import HomeMenu from "@/components/HomeMenu";

async function Page() {
  const db = createClient();

  const { data: settingsData } = await db.from("setttings").select();
  if (!settingsData || (settingsData && settingsData.length == 0)) return null;
  const settings = settingsData[0];

  const { data: nodesData } = await db.from("nodes").select(`*, nodes_extras(*)`);
  if (!nodesData || (nodesData && nodesData.length == 0)) return null;

  return (
    <div className="h-full flex flex-row justify-center items-center bg-background relative">
      <div className="absolute inset-0 lg:hidden">
        <Image className="p-20 w-full h-full object-contain opacity-20" src={staticSettings.signature || ""} alt="Background signature" layout="fill" />
      </div>
      <Image
        className="w-full h-[70%] mt-12 opacity-75 object-contain hidden lg:block"
        src={staticSettings.signature || ""}
        alt="Signature"
        width={100}
        height={200}
      />
      <HomeMenu nodes={nodesData} setttings={settings} />
    </div>
  );
}

export default Page;
