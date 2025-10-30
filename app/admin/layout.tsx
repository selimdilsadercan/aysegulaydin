"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { adminAuth } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Check auth on mount and pathname change
    setIsAuthenticated(adminAuth.isAuthenticated());
    setIsChecking(false);
  }, [pathname]);

  useEffect(() => {
    if (isChecking) return;

    // If not on login page and not authenticated, redirect to login
    if (!isLoginPage && !isAuthenticated) {
      router.push("/admin/login");
    }

    // If on login page and already authenticated, redirect to nodes
    if (isLoginPage && isAuthenticated) {
      router.push("/admin/nodes");
    }
  }, [isAuthenticated, isLoginPage, isChecking]);

  const handleLogout = () => {
    adminAuth.logout();
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  // Don't show sidebar on login page
  if (isLoginPage) {
    return (
      <div style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>{children}</div>
    );
  }

  const navItems = [
    { href: "/admin/nodes", label: "Nodes" },
    { href: "/admin/recent", label: "Recent Works" },
    { href: "/admin/settings", label: "Settings" }
  ];

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
      className="min-h-screen bg-background"
    >
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-300 min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b border-gray-300">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-white" : "text-primary hover:bg-gray-100"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </div>
  );
}
