"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAuth } from "@/lib/admin-auth";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to nodes if authenticated, otherwise to login
    if (adminAuth.isAuthenticated()) {
      router.push("/admin/nodes");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return null;
}
