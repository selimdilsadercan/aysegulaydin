"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowRight, Facebook, Instagram, Mail } from "lucide-react";
import { useState } from "react";
import { Nodes, Settings, Types } from "@/database.types";
import CustomCursor from "./CustomCursor";

interface Props {
  className?: string;
  title: string;
  href?: string;
  variant: "variant1" | "variant2" | "variant3";
  image?: string;
  settings?: Settings;
  nodes?: Nodes[];
  isSetNodes?: boolean;
}

function AnimatedText({ className, title, href, image, variant, settings, nodes, isSetNodes = false }: Props) {
  const router = useRouter();
  const [isSlided, setIsSlided] = useState(false);

  if (isSetNodes && nodes) {
    sessionStorage.setItem("nodesData", JSON.stringify(nodes));
  }

  const handleInteraction = () => {
    if (href) {
      router.push(href);
    } else {
      setIsSlided(true);
    }
  };

  return (
    <div className={cn("h-[55px] w-full overflow-hidden cursor-pointer", className)} onClick={handleInteraction}>
      {image && <CustomCursor isVisible={true} src={image} />}
      <div
        className={cn("h-[110px] w-full flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-[55px]", isSlided && "-translate-y-[55px]")}
      >
        <p className="h-[55px] w-fit font-normal text-primary text-[29px] flex items-center">{title}</p>
        <div className="h-[55px] w-fit flex items-center gap-2.5">
          {variant === "variant1" && (
            <>
              <p className="font-normal text-primary text-[29px] opacity-60">{title}</p>
              <ArrowRight size={35} className="text-primary opacity-60" />
            </>
          )}
          {variant === "variant2" && (
            <>
              <Instagram size={35} className="text-primary hover:opacity-60" onClick={() => window.open(settings?.contact_instagram!, "_blank")} />
              <Facebook size={35} className="text-primary hover:opacity-60" onClick={() => window.open(settings?.contact_facebook!, "_blank")} />
              <Mail size={35} className="text-primary hover:opacity-60" onClickCapture={() => (window.location.href = `mailto:${settings?.contact_mail}}`)} />
            </>
          )}
          {variant === "variant3" && (
            <>
              <p className="font-normal text-primary text-[29px] hover:opacity-60">TR</p>
              <p className="font-normal text-primary text-[29px] hover:opacity-60">ITA</p>
              <p className="font-normal text-primary text-[29px] hover:opacity-60">ENG</p>
              <p className="font-normal text-primary text-[29px] hover:opacity-60">ALM</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimatedText;
