"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  // Authentication is handled by the layout

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-secondary mt-1">Welcome to the admin panel</p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-2">Overview</h2>
            <p className="text-secondary text-sm">Manage your content and settings</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-2">Content</h2>
            <p className="text-secondary text-sm">Add, edit, or remove content</p>
          </div>

          <div
            onClick={() => router.push("/admin/settings")}
            className="bg-white border border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-primary mb-2">Settings</h2>
            <p className="text-secondary text-sm">Configure application settings</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mt-8 bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <p className="text-secondary">Admin dashboard is ready. You can start adding features here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
