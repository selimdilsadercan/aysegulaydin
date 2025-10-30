"use client";

import { useTranslations } from "@/lib/i18n-client";
import Exit from "@/components/Exit";

interface Props {
  isSmallScreen: boolean;
}

export default function GalleryClient({ isSmallScreen }: Props) {
  const { t } = useTranslations();

  return <Exit className={isSmallScreen ? "h-full w-full flex justify-center" : "pb-16 "} text={t("gallery.exitGallery")} width={120} />;
}
