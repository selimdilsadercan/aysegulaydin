"use client";

import { useTranslations } from "@/lib/i18n-client";
import Exit from "@/components/Exit";

export default function StatementClient() {
  const { t } = useTranslations();

  return <Exit text={t("gallery.goToHome")} overridenPath="/home" width={40} />;
}
