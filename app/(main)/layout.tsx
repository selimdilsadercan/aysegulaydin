"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component has mounted on the client
    setIsClient(true);

    if (isClient) {
      const mediaQuery = window.matchMedia("(max-width: 768px)"); // Mobile screen width

      if (mediaQuery.matches) {
        // Navigate to /portfolio if on mobile
        router.push("/portfolio");
      }
    }
  }, [isClient, router]);

  return <div className="bg-background h-full">{children}</div>;
}

export default Layout;
