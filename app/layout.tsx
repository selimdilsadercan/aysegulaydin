import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-client";

const font = IBM_Plex_Mono({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayşegül Aydın"
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className={font.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

export default Layout;
