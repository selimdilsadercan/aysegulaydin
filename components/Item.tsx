import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface Props {
  className?: string;
  src: string;
  title: string;
  description: string;
}

export default function Item({ className, src, title, description }: Props) {
  const [imageWidth, setImageWidth] = useState(0);

  return (
    <div className={cn("flex flex-col justify-start items-start gap-6", className)}>
      <div className="relative h-[240px] mb-6">
        <Image
          src={src}
          alt={"An Image About " + title}
          className="object-cover border-2 border-white shadow-xl"
          height={240}
          width={240}
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            const aspectRatio = naturalWidth / naturalHeight;
            setImageWidth(240 * aspectRatio);
          }}
          style={{ width: `${imageWidth}px`, height: "240px" }}
        />
      </div>
      <div className="flex flex-col justify-start items-start gap-4 pl-1 h-[100px] overflow-hidden" style={{ width: `${imageWidth}px` }}>
        <p className="w-full overflow-visible font-normal text-primary text-sm text-start uppercase">{title}</p>
        <p className="w-full truncate-multiline font-normal text-secondary text-sm text-start">{description}</p>
      </div>
    </div>
  );
}
