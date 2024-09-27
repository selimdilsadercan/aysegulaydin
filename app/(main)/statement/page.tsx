import Exit from "@/components/Exit";
import Image from "next/image";
import { createClient } from "@/lib/db";

async function Page() {
  const db = createClient();

  const { data } = await db.from("setttings").select();
  if (!data || (data && data.length == 0)) return null;
  const settings = data[0];

  return (
    <div className="h-full flex flex-row justify-start items-center gap-2.5">
      <div className="w-3/5 h-full flex flex-col justify-center items-center px-[50px] py-6">
        <div className="w-fit flex flex-col justify-center items-center gap-4 p-[72px]">
          <p className="w-full font-semibold text-primary text-[20px] uppercase">{settings.statement_title}</p>
          <p className="w-full font-normal text-secondary text-[18px]">{settings.statement_description}</p>
        </div>
        <Exit text="Exit Statement" width={40} />
      </div>
      <Image className="w-2/5 h-full object-contain" src={settings.statement_image_url ?? ""} alt="" width={300} height={500} />
    </div>
  );
}

export default Page;
