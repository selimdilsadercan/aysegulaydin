"use client";

import { useEffect, useState } from "react";
import { createAdminClient } from "@/lib/supabase-client";
import { Settings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    statement_title: "",
    statement_description: "",
    contact_facebook: "",
    contact_instagram: "",
    contact_mail: ""
  });

  useEffect(() => {
    // Authentication is handled by the layout
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const supabase = createAdminClient();
      const { data, error } = await supabase.from("setttings").select().limit(1).single();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setFormData({
          statement_title: data.statement_title || "",
          statement_description: data.statement_description || "",
          contact_facebook: data.contact_facebook || "",
          contact_instagram: data.contact_instagram || "",
          contact_mail: data.contact_mail || ""
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const supabase = createAdminClient();
      const { error } = await supabase
        .from("setttings")
        .update({
          statement_title: formData.statement_title || null,
          statement_description: formData.statement_description || null,
          contact_facebook: formData.contact_facebook || null,
          contact_instagram: formData.contact_instagram || null,
          contact_mail: formData.contact_mail || null
        })
        .eq("id", settings.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchSettings(); // Refresh to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="text-secondary mt-1">Manage your site settings</p>
        </div>

        {/* Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">Settings saved successfully!</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary border-b border-gray-200 pb-2">Statement Section</h2>

            <div>
              <label htmlFor="statement_title" className="block text-sm font-medium text-primary mb-2">
                Statement Title
              </label>
              <input
                type="text"
                id="statement_title"
                name="statement_title"
                value={formData.statement_title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter statement title"
              />
            </div>

            <div>
              <label htmlFor="statement_description" className="block text-sm font-medium text-primary mb-2">
                Statement Description
              </label>
              <textarea
                id="statement_description"
                name="statement_description"
                value={formData.statement_description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter statement description"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary border-b border-gray-200 pb-2">Contact Information</h2>

            <div>
              <label htmlFor="contact_facebook" className="block text-sm font-medium text-primary mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                id="contact_facebook"
                name="contact_facebook"
                value={formData.contact_facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label htmlFor="contact_instagram" className="block text-sm font-medium text-primary mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                id="contact_instagram"
                name="contact_instagram"
                value={formData.contact_instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label htmlFor="contact_mail" className="block text-sm font-medium text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                id="contact_mail"
                name="contact_mail"
                value={formData.contact_mail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
