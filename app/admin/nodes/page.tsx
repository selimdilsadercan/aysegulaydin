"use client";

import { useEffect, useState } from "react";
import { createAdminClient } from "@/lib/supabase-client";
import { Type } from "@/types";
import { Database, Constants } from "@/lib/supabase-types";

type NodeWithExtras = Database["public"]["Tables"]["nodes"]["Row"];

export default function AdminNodesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Type | null>(null);
  const [nodes, setNodes] = useState<NodeWithExtras[]>([]);
  const [editingNode, setEditingNode] = useState<NodeWithExtras | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "" as Type | "",
    image_url: "",
    youtube_link: "",
    technical: "",
    index: null as number | null,
    is_video: false,
    is_recent: false,
    visible_date: "",
    recent_work_date: ""
  });

  const categories = Constants.public.Enums.type.filter((cat) => cat !== "recent");

  // Authentication is handled by the layout

  useEffect(() => {
    if (selectedCategory) {
      fetchNodes();
    } else {
      setNodes([]);
    }
  }, [selectedCategory]);

  const fetchNodes = async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      const supabase = createAdminClient();

      let query = supabase.from("nodes").select("*");

      query = query.eq("type", selectedCategory);

      const { data, error } = await query.order("index", { ascending: true, nullsFirst: false });

      if (error) throw error;

      const sortedNodes = (data || []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

      setNodes(sortedNodes as NodeWithExtras[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load nodes");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Type) => {
    setSelectedCategory(category);
    setEditingNode(null);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "" as Type | "",
      image_url: "",
      youtube_link: "",
      technical: "",
      index: null,
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
      type: (node.type || "") as Type | "",
      image_url: node.image_url || "",
      youtube_link: node.youtube_link || "",
      technical: node.technical || "",
      index: node.index,
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
    if (selectedCategory) {
      setFormData((prev) => ({ ...prev, type: selectedCategory }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingNode(null);
    setIsCreating(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      setError("Please select a category first");
      return;
    }

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
        is_video: formData.is_video,
        is_recent: formData.is_recent,
        visible_date: formData.visible_date || null,
        recent_work_date: formData.recent_work_date || null
      };

      if (editingNode) {
        const { error } = await supabase.from("nodes").update(submitData).eq("id", editingNode.id);

        if (error) throw error;
      } else {
        // When creating, set index to last if not provided
        if (submitData.index === null) {
          const maxIndex = nodes.length > 0 ? Math.max(...nodes.map((n) => n.index ?? 0)) : -1;
          submitData.index = maxIndex + 1;
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

  const handleDelete = async (nodeId: string) => {
    if (!confirm("Are you sure you want to delete this node?")) return;

    try {
      setError("");
      const supabase = createAdminClient();
      const { error } = await supabase.from("nodes").delete().eq("id", nodeId);

      if (error) throw error;

      fetchNodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete node");
    }
  };

  const handleReorder = async (node: NodeWithExtras, direction: "up" | "down") => {
    if (!selectedCategory) {
      setError("Please select a category first");
      return;
    }

    try {
      setError("");
      const supabase = createAdminClient();

      const currentIndex = node.index ?? 0;
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      // Call the swap function
      const { error } = await supabase.rpc("swap_node_items", {
        index1: currentIndex,
        direction: direction,
        type_string: selectedCategory
      });

      if (error) throw error;

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
    } else if (name === "index") {
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
          <h1 className="text-3xl font-bold text-primary">Nodes Management</h1>
          <p className="text-secondary mt-1">Manage your nodes by category</p>
        </div>

        {/* Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">Node saved successfully!</div>}

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category as Type)}
                className={`px-4 py-3 rounded-md transition-colors text-left ${
                  selectedCategory === category ? "bg-primary text-white" : "bg-white border border-gray-300 text-primary hover:bg-gray-50"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Create/Edit Form */}
        {(editingNode || isCreating) && selectedCategory && (
          <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">{editingNode ? "Edit Node" : "Create New Node"}</h2>
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
                  <label htmlFor="type" className="block text-sm font-medium text-primary mb-2">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
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
                  <label htmlFor="index" className="block text-sm font-medium text-primary mb-2">
                    Index (for ordering)
                  </label>
                  <input
                    type="number"
                    id="index"
                    name="index"
                    value={formData.index ?? ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Auto"
                  />
                </div>

                <div>
                  <label htmlFor="visible_date" className="block text-sm font-medium text-primary mb-2">
                    Visible Date
                  </label>
                  <input
                    type="date"
                    id="visible_date"
                    name="visible_date"
                    value={formData.visible_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
        {selectedCategory && (
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Nodes ({nodes.length})
              </h2>
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
              <div className="text-secondary text-center py-8">No nodes found in this category</div>
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
                            {node.type && <span className="px-2 py-1 text-xs bg-gray-100 text-secondary rounded">{node.type}</span>}
                          </div>
                          {node.description && <p className="text-secondary text-sm mb-2 line-clamp-2">{node.description}</p>}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {node.is_video || node.youtube_link ? (
                              <span className="px-2 py-1 bg-red-50 text-red-600 rounded font-medium">🎥 Video</span>
                            ) : (
                              node.image_url && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium">📷 Image</span>
                            )}
                            {node.is_recent && <span className="px-2 py-1 bg-green-50 text-green-600 rounded">⭐ Recent</span>}
                            {node.technical && <span className="text-secondary">📝 Has technical</span>}
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
                            onClick={() => (window.location.href = `/admin/nodes/${node.id}`)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-primary hover:bg-gray-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(node.id)}
                            className="px-3 py-1 text-sm border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedCategory && (
          <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
            <p className="text-secondary">Select a category to view and manage nodes</p>
          </div>
        )}
      </div>
    </div>
  );
}
