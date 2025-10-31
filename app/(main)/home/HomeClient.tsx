"use client";

import AnimatedText from "@/components/AnimatedText";
import { ExtendedNode, Settings } from "@/types";

interface Props {
  nodesData: ExtendedNode[];
  settings: Settings;
}

export default function HomeClient({ nodesData, settings }: Props) {
  return (
    <>
      <AnimatedText title="RECENT WORKS" variant="variant1" href="/gallery/recent" nodes={nodesData} isSetNodes />
      <AnimatedText title="PORTFOLIO" variant="variant1" nodes={nodesData} href="/portfolio" />
      <AnimatedText title="BIO AND STATEMENT " variant="variant1" href="/" nodes={nodesData} />
      <AnimatedText title="LANGUAGE" variant="variant3" settings={settings} />
      <AnimatedText title="CONTACT" variant="variant2" settings={settings} />
    </>
  );
}
