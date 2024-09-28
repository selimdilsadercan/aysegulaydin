"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowRight, Facebook, Instagram, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ExtendedNode, Settings } from "@/types";
import CustomCursor from "./CustomCursor";

interface Props {
  className?: string;
  title: string;
  href?: string;
  variant: "variant1" | "variant2" | "variant3" | "variant4" | "variant5" | "variant6";
  image?: string;
  settings?: Settings;
  nodes?: ExtendedNode[];
  isSetNodes?: boolean;
}

export default function AnimatedText({ className, title, href, image, variant, settings, nodes, isSetNodes = false }: Props) {
  const router = useRouter();
  const [isSlided, setIsSlided] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (isSetNodes && nodes) {
    sessionStorage.setItem("nodesData", JSON.stringify(nodes));
  }

  if (settings) {
    sessionStorage.setItem("settingsData", JSON.stringify(settings));
  }

  const handleInteraction = () => {
    if (href) {
      router.push(href);
    } else {
      setIsSlided(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        setCursorPosition({
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className={cn("h-[55px] w-full overflow-hidden cursor-pointer relative", className)} onClick={handleInteraction}>
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
                <Instagram
                  size={35}
                  className="text-primary hover:opacity-60"
                  onClick={() => settings?.contact_instagram && window.open(settings.contact_instagram, "_blank")}
                />
                <Facebook
                  size={35}
                  className="text-primary hover:opacity-60"
                  onClick={() => settings?.contact_facebook && window.open(settings.contact_facebook, "_blank")}
                />
                <Mail
                  size={35}
                  className="text-primary hover:opacity-60"
                  onClickCapture={() => settings?.contact_mail && (window.location.href = `mailto:${settings.contact_mail}`)}
                />
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
            {variant === "variant4" && (
              <>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/photo")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">PHOTO</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/video")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">VIDEO</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/audio")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">AUDIO</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
              </>
            )}
            {variant === "variant5" && (
              <>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/drawing")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">DRAWING</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/oil")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">OIL</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/abstract")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">ABSTRACT</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/digital")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">DIGITAL</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
              </>
            )}
            {variant === "variant6" && (
              <>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/performance")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">PERFORMANCE</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
                <div className="group flex flex-row items-center" onClick={() => router.push("/gallery/installation")}>
                  <p className="font-normal text-primary text-[29px] group-hover:opacity-60">INSTALLATIONS</p>
                  <ArrowRight size={35} className="hidden group-hover:block text-primary opacity-60" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {image && <CustomCursor isVisible={isHovered} src={image} x={cursorPosition.x} y={cursorPosition.y} />}
    </>
  );
}
