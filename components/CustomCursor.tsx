"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  src: string;
  isVisible: boolean;
}

export default function CustomCursor({ src, isVisible }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return (
    <>
      <div
        className={cn("fixed pointer-events-none z-50 transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0")}
        style={{
          left: `${position.x + 120}px`,
          top: `${position.y + 40}px`,
          transform: "translate(-100%, 0%)"
        }}
      >
        <div className="animate-rotate-3d">
          <Image src={src} alt="" width={100} height={156} />
        </div>
      </div>
      <style jsx global>{`
        @keyframes rotate3d {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        .animate-rotate-3d {
          animation: rotate3d 2.5s linear infinite;
        }
      `}</style>
    </>
  );
}
