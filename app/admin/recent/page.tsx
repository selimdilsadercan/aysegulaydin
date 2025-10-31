"use client";

import { useEffect, useState } from "react";
import { createAdminClient } from "@/lib/supabase-client";
import { Database } from "@/lib/supabase-types";
import ConfirmDialog from "@/components/ConfirmDialog";

type NodeWithExtras = Database["public"]["Tables"]["nodes"]["Row"];

export default function AdminRecentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [nodes, setNodes] = useState<NodeWithExtras[]>([]);
  const [editingNode, setEditingNode] = useState<NodeWithExtras | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    nodeId: string;
    nodeName: string;
  }>({
    isOpen: false,
    nodeId: "",
    nodeName: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    image_url: "",
    youtube_link: "",
    technical: "",
    index: null as number | null,
    recent_index: null as number | null,
    is_video: false,
    is_recent: false,
    visible_date: "",
    recent_work_date: ""
  });

  useEffect(() => {
    // Authentication is handled by the layout
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const supabase = createAdminClient();

      const { data, error } = await supabase
        .from("nodes")
        .select("*")
        .eq("is_recent", true)
        .eq("is_active", true)
        .order("recent_index", { ascending: true, nullsFirst: false });

      if (error) throw error;

      const sortedNodes = (data || []).sort((a, b) => {
        const indexA = (a as any).recent_index ?? 0;
        const indexB = (b as any).recent_index ?? 0;
        return indexA - indexB;
      });

      setNodes(sortedNodes as NodeWithExtras[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load nodes");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      image_url: "",
      youtube_link: "",
      technical: "",
      index: null,
      recent_index: null,
      is_video: false,
      is_recent: false,
      visible_date: "",
      recent_work_date: ""
    });
  };

  const handleEdit = (node: NodeWithExtras) => {
    setEditingNode(node);
    setIsCreating(false);
    setFormData({
      name: node.name || "",
      description: node.description || "",
      type: node.type || "",
      image_url: node.image_url || "",
      youtube_link: node.youtube_link || "",
      technical: node.technical || "",
      index: node.index,
      recent_index: (node as any).recent_index ?? null,
      is_video: node.is_video || false,
      is_recent: node.is_recent || false,
      visible_date: node.visible_date || "",
      recent_work_date: node.recent_work_date || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setEditingNode(null);
    setIsCreating(true);
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingNode(null);
    setIsCreating(false);
    resetForm();
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
        is_video: formData.is_video,
        is_recent: formData.is_recent,
        visible_date: formData.visible_date || null,
        recent_work_date: formData.recent_work_date || null
      };

      if (editingNode) {
        const { error } = await supabase.from("nodes").update(submitData).eq("id", editingNode.id);

        if (error) throw error;
      } else {
        // When creating, set recent_index to last if not provided
        if (submitData.recent_index === null) {
          const maxIndex = nodes.length > 0 ? Math.max(...nodes.map((n) => (n as any).recent_index ?? 0)) : -1;
          submitData.recent_index = maxIndex + 1;
        }

        const { error } = await supabase.from("nodes").insert(submitData).select().single();

        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchNodes();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save node");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFromRecent = async () => {
    try {
      setError("");
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("nodes")
        .update({ is_recent: false, recent_index: null } as any)
        .eq("id", confirmDialog.nodeId);

      if (error) throw error;

      setConfirmDialog({ isOpen: false, nodeId: "", nodeName: "" });
      fetchNodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove from recent works");
      setConfirmDialog({ isOpen: false, nodeId: "", nodeName: "" });
    }
  };

  const openRemoveDialog = (nodeId: string, nodeName: string) => {
    setConfirmDialog({
      isOpen: true,
      nodeId,
      nodeName
    });
  };

  const handleView = (nodeId: string) => {
    // Navigate to the node detail page
    window.location.href = `/admin/nodes/${nodeId}`;
  };

  const handleReorder = async (node: NodeWithExtras, direction: "up" | "down") => {
    try {
      setError("");
      const supabase = createAdminClient();

      // Find current position in the array
      const currentArrayIndex = nodes.findIndex((n) => n.id === node.id);
      const targetArrayIndex = direction === "up" ? currentArrayIndex - 1 : currentArrayIndex + 1;

      // Check if target position is valid
      if (targetArrayIndex < 0 || targetArrayIndex >= nodes.length) {
        setError("Cannot move item beyond list boundaries");
        return;
      }

      const currentNode = nodes[currentArrayIndex];
      const targetNode = nodes[targetArrayIndex];

      const currentRecentIndex = ((currentNode as any).recent_index ?? 0) as number;
      const targetRecentIndex = ((targetNode as any).recent_index ?? 0) as number;

      // Swap the recent_index values
      const { error: error1 } = await supabase
        .from("nodes")
        .update({ recent_index: targetRecentIndex } as any)
        .eq("id", currentNode.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from("nodes")
        .update({ recent_index: currentRecentIndex } as any)
        .eq("id", targetNode.id);

      if (error2) throw error2;

      fetchNodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder nodes");
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

  // Authentication is handled by the layout

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Recent Works</h1>
          <p className="text-secondary mt-1">Manage your recent works</p>
        </div>

        {/* Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">Node saved successfully!</div>}

        {/* Create/Edit Form */}
        {(editingNode || isCreating) && (
          <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">{editingNode ? "Edit Node" : "Create New Recent Work"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="recent_work_date" className="block text-sm font-medium text-primary mb-2">
                    Recent Work Date *
                  </label>
                  <input
                    type="date"
                    id="recent_work_date"
                    name="recent_work_date"
                    value={formData.recent_work_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-primary mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

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
                    placeholder="https://..."
                  />
                </div>
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

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="checkbox" name="is_video" checked={formData.is_video} onChange={handleChange} className="mr-2" />
                  <span className="text-primary">Is Video</span>
                </label>

                <label className="flex items-center">
                  <input type="checkbox" name="is_recent" checked={formData.is_recent} onChange={handleChange} className="mr-2" />
                  <span className="text-primary">Is Recent</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Saving..." : editingNode ? "Update Node" : "Create Node"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Nodes List */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Recent Works ({nodes.length})</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              + Create New
            </button>
          </div>

          {loading ? (
            <div className="text-secondary text-center py-8">Loading...</div>
          ) : nodes.length === 0 ? (
            <div className="text-secondary text-center py-8">No recent works found</div>
          ) : (
            <div className="space-y-4">
              {nodes.map((node, idx) => (
                <div key={node.id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {node.image_url ? (
                        <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
                          {node.is_video ? (
                            <video src={node.image_url} className="w-full h-full object-cover" controls preload="metadata" />
                          ) : (
                            <>
                              <img
                                src={node.image_url || ""}
                                alt={node.name || "Node thumbnail"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              {node.youtube_link && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                                    <span className="text-red-600 text-3xl">▶</span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-md bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-primary">{node.name || "Untitled"}</h3>
                          {node.recent_work_date && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-secondary rounded">{new Date(node.recent_work_date).toLocaleDateString()}</span>
                          )}
                        </div>
                        {node.description && <p className="text-secondary text-sm mb-2 line-clamp-2">{node.description}</p>}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {node.is_video || node.youtube_link ? (
                            <span className="px-2 py-1 bg-red-50 text-red-600 rounded font-medium">🎥 Video</span>
                          ) : (
                            node.image_url && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium">📷 Image</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <>
                          <button
                            onClick={() => handleReorder(node, "up")}
                            disabled={idx === 0}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleReorder(node, "down")}
                            disabled={idx === nodes.length - 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Move down"
                          >
                            ↓
                          </button>
                        </>
                        <button
                          onClick={() => handleView(node.id)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md text-primary hover:bg-gray-100 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openRemoveDialog(node.id, node.name || "Untitled")}
                          className="px-3 py-1 text-sm border border-orange-300 text-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                        >
                          Remove from Recent
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remove from Recent Works"
        message={`Are you sure you want to remove "${confirmDialog.nodeName}" from recent works? This will not delete the node, it will just remove it from the recent section.`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmButtonClass="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500"
        onConfirm={handleRemoveFromRecent}
        onCancel={() => setConfirmDialog({ isOpen: false, nodeId: "", nodeName: "" })}
      />
    </div>
  );
}
