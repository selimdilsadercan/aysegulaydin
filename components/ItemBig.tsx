import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface Props {
  className?: string;
  src: string;
  title: string;
  description: string;
}

export default function ItemBig({ className, src, title, description }: Props) {
  const [imageWidth, setImageWidth] = useState(0);

  return (
    <div className={cn("flex flex-col justify-start items-start gap-6", className)}>
      <div className="relative h-[360px] mb-6">
        <Image
          src={src}
          alt={"An Image About " + title}
          className="object-cover border-2 border-white shadow-xl"
          height={360}
          width={360}
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            const aspectRatio = naturalWidth / naturalHeight;
            setImageWidth(360 * aspectRatio);
          }}
          style={{ width: `${imageWidth}px`, height: "360px" }}
        />
      </div>
      <div className="flex flex-col justify-center items-start gap-4 pl-1" style={{ width: `${imageWidth}px` }}>
        <p className="w-full overflow-visible font-normal text-primary text-sm text-start uppercase">{title}</p>
        <p className="w-full overflow-visible font-normal text-secondary text-sm text-start">{description}</p>
      </div>
    </div>
  );
}
