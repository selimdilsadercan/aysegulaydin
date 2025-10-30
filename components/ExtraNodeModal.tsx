"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { createAdminClient } from "@/lib/supabase-client";

interface ExtraFormData {
  image_url: string;
  description: string;
  technical: string;
  youtube_url: string;
  index: number | null;
  is_video: boolean;
}

interface ExtraNodeModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: ExtraFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, uploadedImageUrl?: string, isVideo?: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  saving: boolean;
}

export default function ExtraNodeModal({ isOpen, isEditing, formData, onClose, onSubmit, onChange, saving }: ExtraNodeModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmitWithUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrl = formData.image_url;
    let isVideoFile = formData.is_video;

    // If there's a selected file, upload it first
    if (selectedFile) {
      try {
        const supabase = createAdminClient();
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

        // Upload file to Supabase storage in "nodes" bucket
        const { data, error } = await supabase.storage.from("nodes").upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false
        });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage.from("nodes").getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          uploadedImageUrl = urlData.publicUrl;
          isVideoFile = selectedFile.type.startsWith("video/");

          // Update formData with the uploaded image URL
          onChange({ target: { name: "image_url", value: uploadedImageUrl } } as React.ChangeEvent<HTMLInputElement>);
          // Update is_video if needed
          if (isVideoFile) {
            onChange({ target: { name: "is_video", type: "checkbox", checked: true } } as React.ChangeEvent<HTMLInputElement>);
          }
          setSelectedFile(null);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
        return; // Don't submit the form if upload fails
      }
    }

    // Call the parent's onSubmit handler with the uploaded URL and video status
    onSubmit(e, uploadedImageUrl, isVideoFile);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideIn" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-primary">{isEditing ? "Edit Extra Node" : "Create Extra Node"}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmitWithUpload} className="p-6 space-y-4">
          <div>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => onChange({ target: { name: "image_url", value: url } } as React.ChangeEvent<HTMLInputElement>)}
              onFileSelect={(file) => setSelectedFile(file)}
              onVideoChange={(isVideo) => onChange({ target: { name: "is_video", type: "checkbox", checked: isVideo } } as React.ChangeEvent<HTMLInputElement>)}
              accept="image/*,video/*"
              label="Image/Video Upload"
            />
          </div>

          <div>
            <label htmlFor="modal-youtube_url" className="block text-sm font-medium text-primary mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              id="modal-youtube_url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="modal-description" className="block text-sm font-medium text-primary mb-2">
              Description
            </label>
            <textarea
              id="modal-description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label htmlFor="modal-technical" className="block text-sm font-medium text-primary mb-2">
              Technical Details
            </label>
            <textarea
              id="modal-technical"
              name="technical"
              value={formData.technical}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter technical details"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Extra Node" : "Create Extra Node"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
