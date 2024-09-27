"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import settings from "@/data/settings";

interface Props {
  className?: string;
  text: string;
  width: number;
}

function Exit({ className, text, width }: Props) {
  const router = useRouter();
  return (
    <div className={cn("w-fit h-fit flex flex-col justify-center items-center gap-2.5 group cursor-pointer", className)} onClick={() => router.push("/")}>
      <Image src={settings.signature} alt="" width={width} height={105} className="opacity-70" />
      <p className="w-fit h-fit overflow-visible font-normal text-primary group-hover:underline text-[16px] text-start uppercase">{text}</p>
    </div>
  );
}

export default Exit;
