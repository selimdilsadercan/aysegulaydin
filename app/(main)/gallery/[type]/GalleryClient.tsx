"use client";

import Exit from "@/components/Exit";

interface Props {
  isSmallScreen: boolean;
}

export default function GalleryClient({ isSmallScreen }: Props) {
  return <Exit className={isSmallScreen ? "h-full w-full flex justify-center" : "pb-16 "} text="Exit Gallery" width={120} />;
}
