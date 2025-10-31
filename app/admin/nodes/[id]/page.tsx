"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-client";
import { Database, Constants } from "@/lib/supabase-types";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import ImageUploader from "@/components/ImageUploader";
import ExtraNodeModal from "@/components/ExtraNodeModal";

type NodeWithExtras = Database["public"]["Tables"]["nodes"]["Row"];
type ExtraNode = Database["public"]["Tables"]["nodes_extras"]["Row"];

export default function NodeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [node, setNode] = useState<NodeWithExtras | null>(null);
  const [extraNodes, setExtraNodes] = useState<ExtraNode[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteExtraDialog, setShowDeleteExtraDialog] = useState<string | null>(null);
  const [editingExtra, setEditingExtra] = useState<ExtraNode | null>(null);
  const [isCreatingExtra, setIsCreatingExtra] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    image_url: "",
    youtube_link: "",
    technical: "",
    index: null as number | null,
    recent_index: null as number | null,
    is_recent: false,
    is_video: false,
    visible_date: "",
    recent_work_date: ""
  });
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [extraFormData, setExtraFormData] = useState({
    image_url: "",
    description: "",
    technical: "",
    youtube_url: "",
    index: null as number | null,
    is_video: false
  });

  useEffect(() => {
    fetchNode();
    fetchExtraNodes();
  }, [params.id]);

  const fetchNode = async () => {
    try {
      setLoading(true);
      setError("");
      const supabase = createAdminClient();

      const { data, error } = await supabase.from("nodes").select("*").eq("id", params.id).single();

      if (error) throw error;

      if (!data) {
        setError("Node not found");
        return;
      }

      setNode(data as NodeWithExtras);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        type: data.type || "",
        image_url: data.image_url || "",
        youtube_link: data.youtube_link || "",
        technical: data.technical || "",
        index: data.index,
        recent_index: (data as any).recent_index ?? null,
        is_recent: data.is_recent || false,
        is_video: data.is_video || false,
        visible_date: data.visible_date || "",
        recent_work_date: data.recent_work_date || ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load node");
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraNodes = async () => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from("nodes_extras").select("*").eq("node_id", params.id).order("index", { ascending: true, nullsFirst: false });

      if (error) throw error;
      setExtraNodes((data || []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0)));
    } catch (err) {
      console.error("Failed to load extra nodes:", err);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadingImage(true);
      setError("");

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
        const isVideo = selectedFile.type.startsWith("video/");

        // Update the node with new image URL and video status
        const { error: updateError } = await supabase
          .from("nodes")
          .update({
            image_url: urlData.publicUrl,
            is_video: isVideo
          } as any)
          .eq("id", params.id);

        if (updateError) throw updateError;

        // Update local state
        setFormData((prev) => ({
          ...prev,
          image_url: urlData.publicUrl,
          is_video: isVideo
        }));

        setSelectedFile(null);
        setShowChangeImage(false);
        fetchNode(); // Refresh node data
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const supabase = createAdminClient();

      const submitData: any = {
        name: formData.name || null,
        description: formData.description || null,
        type: formData.type || null,
        image_url: formData.image_url || null,
        youtube_link: formData.youtube_link || null,
        technical: formData.technical || null,
        index: formData.index,
        recent_index: formData.recent_index,
        is_recent: formData.is_recent,
        is_video: formData.is_video,
        visible_date: formData.visible_date || null,
        recent_work_date: formData.recent_work_date || null
      };

      const { error } = await supabase.from("nodes").update(submitData).eq("id", params.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchNode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save node");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setError("");
      const supabase = createAdminClient();
      const { error } = await supabase.from("nodes").delete().eq("id", params.id);

      if (error) throw error;

      router.push("/admin/nodes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete node");
      setShowDeleteDialog(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "index" || name === "recent_index") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? null : parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Extra nodes handlers
  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setExtraFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "index") {
      setExtraFormData((prev) => ({ ...prev, [name]: value === "" ? null : parseInt(value, 10) }));
    } else {
      setExtraFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetExtraForm = () => {
    setExtraFormData({
      image_url: "",
      description: "",
      technical: "",
      youtube_url: "",
      index: null,
      is_video: false
    });
  };

  const handleEditExtra = (extra: ExtraNode) => {
    setEditingExtra(extra);
    setIsCreatingExtra(false);
    setExtraFormData({
      image_url: extra.image_url || "",
      description: extra.description || "",
      technical: extra.technical || "",
      youtube_url: extra.youtube_url || "",
      index: extra.index,
      is_video: extra.is_video || false
    });
  };

  const handleCreateExtra = () => {
    setEditingExtra(null);
    setIsCreatingExtra(true);
    resetExtraForm();
  };

  const handleCancelExtra = () => {
    setEditingExtra(null);
    setIsCreatingExtra(false);
    resetExtraForm();
  };

  const handleSubmitExtra = async (e: React.FormEvent, uploadedImageUrl?: string, isVideo?: boolean) => {
    e.preventDefault();

    try {
      const supabase = createAdminClient();

      // Use uploaded URL if provided, otherwise use formData value
      const imageUrl = uploadedImageUrl !== undefined ? uploadedImageUrl : extraFormData.image_url;
      const videoFlag = isVideo !== undefined ? isVideo : extraFormData.is_video;

      const submitData: any = {
        node_id: params.id,
        image_url: imageUrl || null,
        description: extraFormData.description || null,
        technical: extraFormData.technical || null,
        youtube_url: extraFormData.youtube_url || null,
        index: extraFormData.index,
        is_video: videoFlag
      };

      if (editingExtra) {
        const { error } = await supabase.from("nodes_extras").update(submitData).eq("id", editingExtra.id);
        if (error) throw error;
      } else {
        // Auto-assign index if not provided
        if (submitData.index === null) {
          const maxIndex = extraNodes.length > 0 ? Math.max(...extraNodes.map((n) => n.index ?? 0)) : -1;
          submitData.index = maxIndex + 1;
        }
        const { error } = await supabase.from("nodes_extras").insert(submitData);
        if (error) throw error;
      }

      fetchExtraNodes();
      handleCancelExtra();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save extra node");
    }
  };

  const handleDeleteExtra = async (id: string) => {
    try {
      const supabase = createAdminClient();
      const { error } = await supabase.from("nodes_extras").delete().eq("id", id);

      if (error) throw error;

      fetchExtraNodes();
      setShowDeleteExtraDialog(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete extra node");
      setShowDeleteExtraDialog(null);
    }
  };

  const handleReorderExtra = async (extra: ExtraNode, direction: "up" | "down") => {
    try {
      const supabase = createAdminClient();

      const currentArrayIndex = extraNodes.findIndex((n) => n.id === extra.id);
      const targetArrayIndex = direction === "up" ? currentArrayIndex - 1 : currentArrayIndex + 1;

      if (targetArrayIndex < 0 || targetArrayIndex >= extraNodes.length) return;

      const currentNode = extraNodes[currentArrayIndex];
      const targetNode = extraNodes[targetArrayIndex];

      const currentIndex = currentNode.index ?? 0;
      const targetIndex = targetNode.index ?? 0;

      await supabase.from("nodes_extras").update({ index: targetIndex }).eq("id", currentNode.id);
      await supabase.from("nodes_extras").update({ index: currentIndex }).eq("id", targetNode.id);

      fetchExtraNodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
    }
  };

  const handleToggleRecent = async () => {
    try {
      setError("");
      const supabase = createAdminClient();
      const newIsRecent = !formData.is_recent;

      let updateData: any = { is_recent: newIsRecent };

      if (newIsRecent) {
        // When marking as recent, find the minimum recent_index and set this node's index to min - 1
        const { data: recentNodes, error: fetchError } = await supabase
          .from("nodes")
          .select("recent_index")
          .eq("is_recent", true)
          .eq("is_active", true)
          .neq("id", params.id) // Exclude current node
          .not("recent_index", "is", null);

        if (fetchError) throw fetchError;

        if (recentNodes && recentNodes.length > 0) {
          const recentIndices = recentNodes.map((n) => (n as any).recent_index ?? 0);
          const minIndex = Math.min(...recentIndices);
          updateData.recent_index = minIndex - 1;
        } else {
          // If no recent nodes exist (excluding current), start with 0
          updateData.recent_index = 0;
        }
      } else {
        // When removing from recent, set recent_index to null
        updateData.recent_index = null;
      }

      const { error } = await supabase.from("nodes").update(updateData).eq("id", params.id);

      if (error) throw error;

      setFormData((prev) => ({ ...prev, is_recent: newIsRecent, recent_index: updateData.recent_index }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchNode(); // Refresh node data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update recent status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || "Node not found"}</div>
          <Link href="/admin/nodes" className="text-primary hover:underline">
            Back to Nodes
          </Link>
        </div>
      </div>
    );
  }

  const categories = Constants.public.Enums.type.filter((cat) => cat !== "recent");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/nodes" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Back to Nodes
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">{node.name || "Untitled"}</h1>
              <p className="text-sm text-secondary mt-1">ID: {node.id}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleToggleRecent}
                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  formData.is_recent
                    ? "border-green-500 text-green-700 hover:bg-green-50 focus:ring-green-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
                }`}
              >
                {formData.is_recent ? "Remove from Recent Work" : "Mark as Recent Work"}
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete Node
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">Node updated successfully!</div>}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Node Form */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-primary">Preview</h3>
                {formData.image_url && (
                  <button
                    type="button"
                    onClick={() => setShowChangeImage(!showChangeImage)}
                    className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  >
                    {showChangeImage ? "Cancel" : "Change Image"}
                  </button>
                )}
              </div>

              {showChangeImage ? (
                <div className="space-y-4">
                  <ImageUploader
                    value={formData.image_url}
                    onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                    onFileSelect={(file) => setSelectedFile(file)}
                    onVideoChange={(isVideo) => setFormData((prev) => ({ ...prev, is_video: isVideo }))}
                    accept="image/*,video/*"
                    label="Upload New Image/Video"
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploadingImage ? "Uploading..." : "Upload & Update Node"}
                    </button>
                  )}
                </div>
              ) : formData.image_url ? (
                <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden bg-gray-100">
                  {node.is_video || formData.is_video ? (
                    <video src={formData.image_url} controls className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <img
                        src={formData.image_url}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {formData.youtube_link && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <span className="text-white text-4xl">▶</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-secondary">No image uploaded yet</p>
                  <ImageUploader
                    value=""
                    onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                    onFileSelect={(file) => setSelectedFile(file)}
                    onVideoChange={(isVideo) => setFormData((prev) => ({ ...prev, is_video: isVideo }))}
                    accept="image/*,video/*"
                    label="Upload Image/Video"
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploadingImage ? "Uploading..." : "Upload & Update Node"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Edit Form */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-primary mb-6">Node Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-primary mb-2">
                        Type *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter description"
                      />
                    </div>

                    <div>
                      <label htmlFor="technical" className="block text-sm font-medium text-primary mb-2">
                        Technical Details
                      </label>
                      <textarea
                        id="technical"
                        name="technical"
                        value={formData.technical}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter technical details"
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div>
                  <h3 className="text-lg font-medium text-primary mb-4 pb-2 border-b border-gray-200">Media</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="youtube_link" className="block text-sm font-medium text-primary mb-2">
                        YouTube Link
                      </label>
                      <input
                        type="url"
                        id="youtube_link"
                        name="youtube_link"
                        value={formData.youtube_link}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <Link
                    href="/admin/nodes"
                    className="px-6 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Extra Nodes */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-primary">Extra Nodes ({extraNodes.length})</h2>
                  <p className="text-sm text-secondary mt-1">Additional images/videos for this node</p>
                </div>
                <button
                  onClick={handleCreateExtra}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-sm"
                >
                  + Add Extra
                </button>
              </div>

              {/* Extra Nodes List */}
              {extraNodes.length === 0 ? (
                <div className="text-center py-8 text-secondary text-sm">No extra nodes yet</div>
              ) : (
                <div className="space-y-3">
                  {extraNodes.map((extra, idx) => (
                    <div key={extra.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {extra.image_url ? (
                            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                              {extra.is_video ? (
                                <video src={extra.image_url} className="w-full h-full object-cover" controls preload="metadata" />
                              ) : extra.youtube_url ? (
                                <div className="relative w-full h-full">
                                  <img src={extra.image_url} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                    <span className="text-white text-xl">▶</span>
                                  </div>
                                </div>
                              ) : (
                                <img src={extra.image_url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No img</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary font-medium truncate">{extra.description || "No description"}</p>
                          {extra.technical && <p className="text-xs text-secondary mt-1 truncate">{extra.technical}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleReorderExtra(extra, "up")}
                            disabled={idx === 0}
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleReorderExtra(extra, "down")}
                            disabled={idx === extraNodes.length - 1}
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleEditExtra(extra)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-primary hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteExtraDialog(extra.id)}
                            className="px-2 py-1 text-xs border border-red-300 text-red-500 rounded hover:bg-red-50"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Node Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Node"
        message={`Are you sure you want to delete "${formData.name}"? This action cannot be undone and will permanently remove this node and all its extra nodes from the database.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-500 hover:bg-red-600 focus:ring-red-500"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Delete Extra Node Dialog */}
      <ConfirmDialog
        isOpen={!!showDeleteExtraDialog}
        title="Delete Extra Node"
        message="Are you sure you want to delete this extra node? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-500 hover:bg-red-600 focus:ring-red-500"
        onConfirm={() => showDeleteExtraDialog && handleDeleteExtra(showDeleteExtraDialog)}
        onCancel={() => setShowDeleteExtraDialog(null)}
      />

      {/* Extra Node Modal */}
      <ExtraNodeModal
        isOpen={isCreatingExtra || !!editingExtra}
        isEditing={!!editingExtra}
        formData={extraFormData}
        onClose={handleCancelExtra}
        onSubmit={handleSubmitExtra}
        onChange={handleExtraChange}
        saving={saving}
      />
    </div>
  );
}
