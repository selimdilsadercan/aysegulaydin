"use client";

import Exit from "@/components/Exit";

interface Props {
  isSmallScreen: boolean;
}

export default function ExhibitionClient({ isSmallScreen }: Props) {
  return <Exit className={isSmallScreen ? "w-full flex justify-center mt-8" : "self-center mx-10 pt-8"} text="Exit Exhibition" width={80} />;
}
