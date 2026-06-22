"use client";

import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { apiHelper, festivalWishesAPI } from "../../services/apiService";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  X,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Upload,
  Play,
  ImageIcon,
} from "lucide-react";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm";
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
const THUMB_ACCEPT = IMAGE_ACCEPT;

const AUDIENCES = [
  { value: "all", label: "All users" },
  { value: "school", label: "School" },
  { value: "parent", label: "Parent" },
  { value: "deliveryboy", label: "Delivery Boy" },
];

const MEDIA_TYPES = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

const INITIAL_FORM = {
  title: "",
  message: "",
  mediaType: "image",
  audience: "all",
  startDate: "",
  endDate: "",
  sortOrder: "0",
  isActive: true,
};

function audienceLabel(value) {
  return AUDIENCES.find((a) => a.value === value)?.label || value;
}

function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value) {
  if (!value) return "";
  return new Date(value).toISOString();
}

function formatDateRange(start, end) {
  if (!start || !end) return "—";
  const opts = { dateStyle: "medium", timeStyle: "short" };
  return `${new Date(start).toLocaleString(undefined, opts)} → ${new Date(end).toLocaleString(undefined, opts)}`;
}

function scheduleStatus(row) {
  if (row.isActive === false) return { label: "Inactive", className: "bg-gray-100 text-gray-700" };
  const now = Date.now();
  const start = new Date(row.startDate).getTime();
  const end = new Date(row.endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { label: "Unknown", className: "bg-gray-100 text-gray-700" };
  }
  if (now < start) return { label: "Scheduled", className: "bg-amber-100 text-amber-800" };
  if (now > end) return { label: "Ended", className: "bg-red-100 text-red-800" };
  return { label: "Live", className: "bg-green-100 text-green-800" };
}

function validateVideoFile(file) {
  if (!file) return "Video file is required";
  if (file.size > MAX_VIDEO_BYTES) return "Video must be 100 MB or less";
  const ok =
    file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name);
  if (!ok) return "Use MP4, MOV, or WebM";
  return null;
}

function validateImageFile(file) {
  if (!file) return "Image file is required";
  const ok =
    file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!ok) return "Use JPEG, PNG, or WebP";
  return null;
}

function buildFormData(form, { imageFile, videoFile, thumbnailFile }) {
  const fd = new FormData();
  fd.append("title", form.title.trim());
  if (form.message?.trim()) fd.append("message", form.message.trim());
  fd.append("mediaType", form.mediaType);
  fd.append("audience", form.audience);
  fd.append("startDate", fromDatetimeLocal(form.startDate));
  fd.append("endDate", fromDatetimeLocal(form.endDate));
  fd.append("sortOrder", String(form.sortOrder ?? 0));
  fd.append("isActive", form.isActive ? "true" : "false");
  if (form.mediaType === "image" && imageFile) fd.append("image", imageFile);
  if (form.mediaType === "video" && videoFile) fd.append("video", videoFile);
  if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
  return fd;
}

function FestivalWishModal({ open, mode, initialData, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        message: initialData.message || "",
        mediaType: initialData.mediaType || "image",
        audience: initialData.audience || "all",
        startDate: toDatetimeLocal(initialData.startDate),
        endDate: toDatetimeLocal(initialData.endDate),
        sortOrder: String(initialData.sortOrder ?? 0),
        isActive: initialData.isActive !== false,
      });
      setImageFile(null);
      setVideoFile(null);
      setThumbnailFile(null);
      setMediaPreview(initialData.mediaUrl || null);
      setThumbPreview(initialData.thumbnailUrl || null);
    } else {
      setForm(INITIAL_FORM);
      setImageFile(null);
      setVideoFile(null);
      setThumbnailFile(null);
      setMediaPreview(null);
      setThumbPreview(null);
    }
  }, [open, mode, initialData]);

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      toast.error(err);
      e.target.value = "";
      return;
    }
    setImageFile(file);
    if (mediaPreview?.startsWith("blob:")) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(URL.createObjectURL(file));
  };

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
    if (mediaPreview?.startsWith("blob:")) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(URL.createObjectURL(file));
  };

  const onThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
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
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.startDate || !form.endDate) return toast.error("Start and end dates are required");
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      return toast.error("End date must be after start date");
    }

    if (mode === "add") {
      if (form.mediaType === "image") {
        const err = validateImageFile(imageFile);
        if (err) return toast.error(err);
      } else {
        const err = validateVideoFile(videoFile);
        if (err) return toast.error(err);
      }
    }

    setSaving(true);
    try {
      const fd = buildFormData(form, { imageFile, videoFile, thumbnailFile });
      if (mode === "edit") {
        const id = initialData?.id || initialData?._id;
        await festivalWishesAPI.update(id, fd);
        toast.success("Wish updated");
      } else {
        await festivalWishesAPI.create(fd);
        toast.success("Festival wish created");
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
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-semibold text-gray-900">
              {mode === "edit" ? "Edit Festival Wish" : "Create Festival Wish"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              placeholder="Happy Diwali"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              placeholder="Wishing you joy and prosperity"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Media type</label>
              <select
                value={form.mediaType}
                onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              >
                {MEDIA_TYPES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start date & time</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End date & time</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Lower number = higher priority when multiple wishes overlap</p>
          </div>

          {form.mediaType === "image" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {mode === "edit" ? "(replace optional)" : ""}
              </label>
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                onChange={onImageChange}
                className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-800"
              />
              {mediaPreview && (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="mt-2 max-h-40 w-auto rounded-lg border border-gray-200"
                />
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video {mode === "edit" ? "(replace optional)" : ""}
                </label>
                <input
                  type="file"
                  accept={VIDEO_ACCEPT}
                  onChange={onVideoChange}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-800"
                />
                <p className="text-xs text-gray-500 mt-1">MP4, MOV, WebM — max 100 MB</p>
                {mediaPreview && form.mediaType === "video" && (
                  <video src={mediaPreview} controls className="mt-2 w-full max-h-40 rounded-lg bg-black" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail (optional)
                </label>
                <input
                  type="file"
                  accept={THUMB_ACCEPT}
                  onChange={onThumbChange}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-800"
                />
                {thumbPreview && (
                  <img
                    src={thumbPreview}
                    alt="Thumbnail"
                    className="mt-2 h-20 w-auto rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600"
            />
            Active (shown in app during scheduled dates)
          </label>

          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800">
            <strong>Mobile app:</strong> Close (X) hides for this session only. &quot;Don&apos;t show again&quot; calls the hide API permanently.
          </div>

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
              {saving ? "Saving..." : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {mode === "edit" ? "Save changes" : "Create wish"}
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
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>
        {item.message && (
          <p className="px-4 pt-3 text-sm text-gray-600 text-center">{item.message}</p>
        )}
        {item.mediaType === "image" ? (
          <img src={item.mediaUrl} alt={item.title} className="w-full max-h-80 object-contain bg-gray-50" />
        ) : (
          <video
            src={item.mediaUrl}
            poster={item.thumbnailUrl || undefined}
            controls
            className="w-full max-h-80 bg-black"
          />
        )}
        <div className="px-4 py-3 border-t text-xs text-gray-500 text-center">
          Preview — mobile users see Close vs Don&apos;t show again
        </div>
      </div>
    </div>
  );
}

export default function FestivalWishesPage() {
  const [audienceFilter, setAudienceFilter] = useState("");
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
    async ({ nextPage = page, nextAudience = audienceFilter } = {}) => {
      try {
        setLoading(true);
        const params = { page: nextPage, limit };
        if (nextAudience) params.audience = nextAudience;
        const res = await festivalWishesAPI.list(params);
        const data = apiHelper.handleResponse(res);
        const list = data?.wishes ?? data?.items ?? [];
        setItems(Array.isArray(list) ? list : []);
        setPagination((prev) => ({ ...prev, ...(data?.pagination || {}) }));
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || "Failed to load wishes");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [page, audienceFilter, limit]
  );

  useEffect(() => {
    load({ nextPage: page, nextAudience: audienceFilter });
  }, [page, audienceFilter, load]);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this festival wish? S3 files and user dismissals will be removed.")) return;
    try {
      await festivalWishesAPI.delete(id);
      toast.success("Deleted");
      load({ nextPage: page, nextAudience: audienceFilter });
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
      await festivalWishesAPI.update(id, fd);
      toast.success(nextActive ? "Wish activated" : "Wish deactivated");
      load({ nextPage: page, nextAudience: audienceFilter });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Update failed");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Festival Wishes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Schedule popup images or videos when users open the mobile app
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Wish
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">Filter audience:</label>
          <select
            value={audienceFilter}
            onChange={(e) => {
              setAudienceFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          >
            <option value="">All audiences</option>
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 sm:ml-auto">
            Total: <span className="font-medium text-gray-700">{pagination.total ?? items.length}</span>
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-14 w-20 bg-gray-200 rounded" /></td>
                      <td colSpan={6} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No festival wishes yet. Create one for Diwali, New Year, etc.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => {
                    const id = row.id || row._id;
                    const status = scheduleStatus(row);
                    const thumb = row.thumbnailUrl || (row.mediaType === "image" ? row.mediaUrl : null);
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              className="h-14 w-20 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="h-14 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              {row.mediaType === "video" ? (
                                <Play className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{row.title}</div>
                          {row.message && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{row.message}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{row.mediaType || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{audienceLabel(row.audience)}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[220px]">
                          {formatDateRange(row.startDate, row.endDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(row)}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                            title="Click to toggle active"
                          >
                            {status.label}
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

      <FestivalWishModal
        open={open}
        mode="add"
        initialData={null}
        onClose={() => setOpen(false)}
        onSaved={() => load({ nextPage: page, nextAudience: audienceFilter })}
      />
      <FestivalWishModal
        open={editOpen}
        mode="edit"
        initialData={editRow}
        onClose={() => {
          setEditOpen(false);
          setEditRow(null);
        }}
        onSaved={() => load({ nextPage: page, nextAudience: audienceFilter })}
      />
      <PreviewModal
        open={!!previewItem}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </Layout>
  );
}
