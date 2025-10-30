import { createClient } from "@/lib/db";
import Image from "next/image";
import staticSettings from "@/data/settings";
import PortfolioClient from "./PortfolioClient";

async function Page() {
  const db = createClient();

  const { data: nodes } = await db.from("nodes").select(`*, nodes_extras(*)`).eq("is_active", true);
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
        <PortfolioClient nodes={nodes} />
      </div>
    </div>
  );
}

export default Page;
