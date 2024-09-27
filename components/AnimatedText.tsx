"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowRight, Instagram, Mail, Twitter } from "lucide-react";
import { useState } from "react";
import CustomCursor from "./CustomCursor";

interface Props {
  className?: string;
  title: string;
  href?: string;
  variant: "variant1" | "variant2" | "variant3";
  image?: string;
}

function AnimatedText({ className, title, href, image, variant }: Props) {
  const router = useRouter();
  const [isSlided, setIsSlided] = useState(false);

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
              <Instagram size={35} className="text-primary hover:opacity-60" onClick={() => window.open("https://www.instagram.com/selimdilsad/", "_blank")} />
              <Twitter size={35} className="text-primary hover:opacity-60" onClick={() => window.open("https://x.com/selimdilsadercn", "_blank")} />
              <Mail size={35} className="text-primary hover:opacity-60" onClickCapture={() => (window.location.href = "mailto:dilsadselim@gmail.com")} />
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
