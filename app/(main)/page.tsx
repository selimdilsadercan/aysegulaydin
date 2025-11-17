import Image from "next/image";
import { createClient } from "@/lib/db";
import StatementClient from "./StatementClient";

export default async function Page() {
  const db = createClient();

  const { data: settingsData } = await db.from("setttings").select();
  if (!settingsData || (settingsData && settingsData.length == 0)) return null;
  const settings = settingsData[0];

  return (
    <div className="h-full flex flex-row justify-start items-center gap-2.5">
      <div className="w-full xl:w-3/5 h-full flex flex-col justify-center items-center px-1 xl:px-[20px] py-6">
        <div className="w-fit flex flex-col justify-center items-center gap-4 p-[36px]">
          <p className="w-full font-semibold text-primary text-[20px] uppercase">{settings.statement_title}</p>
          <div className="w-full max-h-[60vh] overflow-y-auto pr-2">
            <p className="w-full font-normal text-secondary text-[18px] text-justify">{settings.statement_description}</p>
          </div>
        </div>
        <StatementClient />
      </div>
      <Image className="hidden xl:block w-2/5 h-full object-contain" src={settings.statement_image_url ?? ""} alt="" width={300} height={500} />
    </div>
  );
}
