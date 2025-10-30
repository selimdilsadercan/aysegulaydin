"use client";

import { useTranslations } from "@/lib/i18n-client";
import Exit from "@/components/Exit";

interface Props {
  isSmallScreen: boolean;
}

export default function ExhibitionClient({ isSmallScreen }: Props) {
  const { t } = useTranslations();

  return <Exit className={isSmallScreen ? "w-full flex justify-center mt-8" : "self-center mx-10 pt-8"} text={t("gallery.exitExhibition")} width={80} />;
}
