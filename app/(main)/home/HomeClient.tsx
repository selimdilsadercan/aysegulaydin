"use client";

import { useTranslations } from "@/lib/i18n-client";
import AnimatedText from "@/components/AnimatedText";
import { ExtendedNode, Settings } from "@/types";

interface Props {
  nodesData: ExtendedNode[];
  settings: Settings;
}

export default function HomeClient({ nodesData, settings }: Props) {
  const { t } = useTranslations();

  return (
    <>
      <AnimatedText title={t("nav.recentWorks")} variant="variant1" href="/gallery/recent" nodes={nodesData} isSetNodes />
      <AnimatedText title={t("nav.portfolio")} variant="variant1" nodes={nodesData} href="/portfolio" />
      <AnimatedText title={t("nav.statement")} variant="variant1" href="/" nodes={nodesData} />
      <AnimatedText title={t("nav.language")} variant="variant3" settings={settings} />
      <AnimatedText title={t("nav.contact")} variant="variant2" settings={settings} />
    </>
  );
}
