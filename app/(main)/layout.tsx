"use client";
import { useEffect } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to lock the orientation
    const lockOrientation = () => {
      if ("orientation" in screen) {
        const screenOrientation = (screen as any).orientation;

        if (screenOrientation.lock) {
          screenOrientation.lock("portrait").catch((error: Error) => {
            console.error("Orientation lock failed:", error);
          });
        } else if (screenOrientation.lockOrientation) {
          screenOrientation.lockOrientation("portrait");
        }
      } else if ("mozLockOrientation" in screen) {
        (screen as any).mozLockOrientation("portrait");
      } else if ("msLockOrientation" in screen) {
        (screen as any).msLockOrientation("portrait");
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
