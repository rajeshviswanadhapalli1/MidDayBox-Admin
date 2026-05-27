"use client";

import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { apiHelper, demoVideosAPI } from "../../services/apiService";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  X,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Video,
  Upload,
  Play,
} from "lucide-react";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm";
const THUMB_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

const AUDIENCES = [
  { value: "school", label: "School" },
  { value: "parent", label: "Parent" },
  { value: "deliveryboy", label: "Delivery Boy" },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  audience: "school",
  sortOrder: "0",
  durationSeconds: "",
  isActive: true,
};

function audienceLabel(value) {
  return AUDIENCES.find((a) => a.value === value)?.label || value;
}

function formatDuration(seconds) {
  if (seconds == null || seconds === "") return "—";
  const n = Number(seconds);
  if (Number.isNaN(n) || n < 0) return "—";
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function validateVideoFile(file) {
  if (!file) return "Video file is required";
  if (file.size > MAX_VIDEO_BYTES) return "Video must be 100 MB or less";
  const ok =
    file.type.startsWith("video/") ||
    /\.(mp4|mov|webm)$/i.test(file.name);
  if (!ok) return "Use MP4, MOV, or WebM";
  return null;
}

function validateThumbnailFile(file) {
  if (!file) return "Thumbnail is required";
  const ok =
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ok) return "Use JPEG, PNG, or WebP";
  return null;
}

function buildFormData(form, { videoFile, thumbnailFile, isEdit }) {
  const fd = new FormData();
  if (videoFile) fd.append("video", videoFile);
  if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
  fd.append("title", form.title.trim());
  fd.append("audience", form.audience);
  if (form.description?.trim()) fd.append("description", form.description.trim());
  fd.append("sortOrder", String(form.sortOrder ?? 0));
  if (form.durationSeconds !== "" && form.durationSeconds != null) {
    fd.append("durationSeconds", String(form.durationSeconds));
  }
  fd.append("isActive", form.isActive ? "true" : "false");
  return fd;
}

function DemoVideoModal({ open, mode, initialData, defaultAudience, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        audience: initialData.audience || "school",
        sortOrder: String(initialData.sortOrder ?? 0),
        durationSeconds:
          initialData.durationSeconds != null
            ? String(initialData.durationSeconds)
            : "",
        isActive: initialData.isActive !== false,
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(initialData.videoUrl || null);
      setThumbPreview(initialData.thumbnailUrl || null);
    } else {
      setForm({ ...INITIAL_FORM, audience: defaultAudience || "school" });
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbPreview(null);
    }
  }, [open, mode, initialData, defaultAudience]);

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }
      if (thumbPreview && thumbPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbPreview);
      }
    };
  }, [videoPreview, thumbPreview]);

  const onVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateVideoFile(file);
    if (err) {
      toast.error(err);
      e.target.value = "";
      return;
    }
    setVideoFile(file);
    if (videoPreview?.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
    setVideoPreview(URL.createObjectURL(file));
  };

  const onThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateThumbnailFile(file);
    if (err) {
      toast.error(err);
      e.target.value = "";
      return;
    }
    setThumbnailFile(file);
    if (thumbPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (mode === "add") {
      const vErr = validateVideoFile(videoFile);
      const tErr = validateThumbnailFile(thumbnailFile);
      if (vErr) return toast.error(vErr);
      if (tErr) return toast.error(tErr);
    }

    setSaving(true);
    try {
      const fd = buildFormData(form, { videoFile, thumbnailFile, isEdit: mode === "edit" });
      if (mode === "edit") {
        const id = initialData?.id || initialData?._id;
        const res = await demoVideosAPI.update(id, fd);
        apiHelper.handleResponse(res);
        toast.success("Video updated");
      } else {
        const res = await demoVideosAPI.create(fd);
        apiHelper.handleResponse(res);
        toast.success("Video uploaded");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-semibold text-gray-900">
              {mode === "edit" ? "Edit Demo Video" : "Upload Demo Video"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
            <select
              value={form.audience}
              onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
            >
              {AUDIENCES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              placeholder="How to use MidDayBox"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              placeholder="Short description for the mobile app"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (sec)</label>
              <input
                type="number"
                min={0}
                value={form.durationSeconds}
                onChange={(e) => setForm((f) => ({ ...f, durationSeconds: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video {mode === "edit" ? "(replace optional)" : ""}
            </label>
            <input
              type="file"
              accept={VIDEO_ACCEPT}
              onChange={onVideoChange}
              className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
            />
            <p className="text-xs text-gray-500 mt-1">MP4, MOV, WebM — max 100 MB</p>
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-2 w-full max-h-40 rounded-lg bg-black"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail {mode === "edit" ? "(replace optional)" : ""}
            </label>
            <input
              type="file"
              accept={THUMB_ACCEPT}
              onChange={onThumbChange}
              className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
            />
            {thumbPreview && (
              <img
                src={thumbPreview}
                alt="Thumbnail preview"
                className="mt-2 h-24 w-auto rounded-lg border border-gray-200 object-cover"
              />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600"
            />
            Active (visible in mobile app)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {mode === "edit" ? "Save changes" : "Upload"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewModal({ open, item, onClose }) {
  if (!open || !item) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900 truncate pr-4">{item.title}</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>
        <video
          src={item.videoUrl}
          poster={item.thumbnailUrl}
          controls
          className="w-full bg-black max-h-[70vh]"
        />
      </div>
    </div>
  );
}

export default function DemoVideosPage() {
  const [audienceTab, setAudienceTab] = useState("school");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const load = useCallback(
    async ({ nextPage = page, nextAudience = audienceTab } = {}) => {
      try {
        setLoading(true);
        const res = await demoVideosAPI.list({
          audience: nextAudience,
          page: nextPage,
          limit,
        });
        const data = apiHelper.handleResponse(res);
        setItems(Array.isArray(data?.videos) ? data.videos : []);
        setPagination((prev) => ({ ...prev, ...(data?.pagination || {}) }));
      } catch (err) {
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to load demo videos"
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [page, audienceTab, limit]
  );

  useEffect(() => {
    load({ nextPage: page, nextAudience: audienceTab });
  }, [page, audienceTab, load]);

  const handleTabChange = (value) => {
    setAudienceTab(value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this demo video? Files will be removed from S3.")) return;
    try {
      await demoVideosAPI.delete(id);
      toast.success("Deleted");
      load({ nextPage: page, nextAudience: audienceTab });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  const handleToggleActive = async (row) => {
    const id = row.id || row._id;
    if (!id) return;
    const nextActive = row.isActive === false;
    try {
      const fd = new FormData();
      fd.append("isActive", nextActive ? "true" : "false");
      await demoVideosAPI.update(id, fd);
      toast.success(nextActive ? "Video activated" : "Video hidden");
      load({ nextPage: page, nextAudience: audienceTab });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Update failed");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demo Videos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload help videos for school, parent, and delivery boy apps (stored in AWS S3)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Upload Video
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
          {AUDIENCES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => handleTabChange(a.value)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                audienceTab === a.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{audienceLabel(audienceTab)}</span>{" "}
          videos — Total:{" "}
          <span className="font-medium text-gray-700">{pagination.total ?? items.length}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thumbnail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4">
                        <div className="h-14 w-24 bg-gray-200 rounded" />
                      </td>
                      <td colSpan={5} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-48" />
                      </td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No demo videos for {audienceLabel(audienceTab)}. Upload one to get started.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => {
                    const id = row.id || row._id;
                    const active = row.isActive !== false;
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {row.thumbnailUrl ? (
                            <img
                              src={row.thumbnailUrl}
                              alt=""
                              className="h-14 w-24 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="h-14 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Video className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{row.title}</div>
                          {row.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                              {row.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatDuration(row.durationSeconds)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {row.sortOrder ?? 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(row)}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            title="Click to toggle"
                          >
                            {active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(row)}
                            className="inline-flex p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            title="Preview"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditRow(row);
                              setEditOpen(true);
                            }}
                            className="inline-flex p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="inline-flex p-2 rounded-md text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DemoVideoModal
        open={open}
        mode="add"
        initialData={null}
        defaultAudience={audienceTab}
        onClose={() => setOpen(false)}
        onSaved={() => load({ nextPage: page, nextAudience: audienceTab })}
      />
      <DemoVideoModal
        open={editOpen}
        mode="edit"
        initialData={editRow}
        defaultAudience={audienceTab}
        onClose={() => {
          setEditOpen(false);
          setEditRow(null);
        }}
        onSaved={() => load({ nextPage: page, nextAudience: audienceTab })}
      />
      <PreviewModal
        open={!!previewItem}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </Layout>
  );
}
