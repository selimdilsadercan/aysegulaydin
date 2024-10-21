/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to lock the orientation
    const lockOrientation = () => {
      // For modern browsers
      const orientation = window.screen.orientation as any; // Ignore 'any' type warning
      if (orientation && typeof orientation.lock === "function") {
        orientation.lock("portrait").catch((error: any) => {
          console.error("Orientation lock failed:", error);
        });
      }
      // For older Firefox
      else if ((window.screen as any).mozLockOrientation) {
        (window.screen as any).mozLockOrientation("portrait");
      }
      // For older IE/Edge
      else if ((window.screen as any).msLockOrientation) {
        (window.screen as any).msLockOrientation("portrait");
      }
    };

    // Call the function when the component mounts
    lockOrientation();

    // Add event listener for orientation change
    window.addEventListener("orientationchange", lockOrientation);

    // Cleanup function
    return () => {
      window.removeEventListener("orientationchange", lockOrientation);
    };
  }, []);

  return <div className="bg-background h-full">{children}</div>;
}

export default Layout;
