"use client";

import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { navigation } from "../../config/navigation";
import { apiHelper, subAdminsAPI } from "../../services/apiService";
import toast from "react-hot-toast";
import { Plus, Shield, Trash2, X, Search, ChevronLeft, ChevronRight, ListChecks, Pencil } from "lucide-react";

const INITIAL_FORM = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  permissions: [],
  isActive: true,
};

function normalizePermissions(list) {
  return Array.isArray(list) ? list.filter(Boolean) : [];
}

function ViewPermissionsModal({ open, onClose, name, permissionKeys }) {
  const labelByKey = useMemo(() => {
    const map = new Map();
    for (const item of navigation) {
      if (item?.permissionKey) map.set(item.permissionKey, item.name);
    }
    return map;
  }, []);

  const list = useMemo(() => {
    const keys = normalizePermissions(permissionKeys);
    const known = keys
      .map((k) => ({ key: k, label: labelByKey.get(k) }))
      .filter((x) => x.label);
    const unknown = keys
      .filter((k) => !labelByKey.get(k))
      .map((k) => ({ key: k, label: k }));
    return [...known, ...unknown];
  }, [permissionKeys, labelByKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <ListChecks className="h-5 w-5 text-blue-600" />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                Permissions
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {name ? `${name} • ` : ""}{list.length} selected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {list.length === 0 ? (
            <div className="text-sm text-gray-600">No permissions assigned.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {list.map((p) => (
                <span
                  key={p.key}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {p.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubAdminModal({ open, mode, initialData, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const permissionOptions = useMemo(() => {
    // Exclude login and any future hidden items if needed
    return navigation
      .filter((i) => i?.permissionKey)
      .map((i) => ({ key: i.permissionKey, label: i.name }));
  }, []);

  const allKeys = useMemo(() => permissionOptions.map((p) => p.key), [permissionOptions]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        mobile: initialData.mobile || initialData.phone || "",
        password: "",
        permissions: normalizePermissions(initialData.permissions || initialData.permissionPages || initialData.pages),
        isActive: initialData.isActive !== false,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [open, mode, initialData]);

  const selected = new Set(form.permissions);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));

  const togglePermission = (key) => {
    setForm((prev) => {
      const set = new Set(prev.permissions);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      return { ...prev, permissions: Array.from(set) };
    });
  };

  const toggleAll = () => {
    setForm((prev) => ({
      ...prev,
      permissions: allSelected ? [] : allKeys,
    }));
  };

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    const payload = {
      name: form.name?.trim(),
      email: form.email?.trim(),
      mobile: form.mobile?.trim(),
      permissions: normalizePermissions(form.permissions),
      isActive: !!form.isActive,
    };

    const password = (form.password || "").trim();
    if (!payload.name || !payload.email || !payload.mobile) {
      toast.error("Please fill name, email and mobile.");
      return;
    }
    if (mode === "add" && !password) {
      toast.error("Password is required.");
      return;
    }
    if (password) payload.password = password;

    try {
      setSaving(true);
      const res =
        mode === "edit"
          ? await subAdminsAPI.updateSubAdmin(initialData?._id || initialData?.id, payload)
          : await subAdminsAPI.createSubAdmin(payload);
      const data = apiHelper.handleResponse(res);
      if (data?.success === false) throw new Error(data?.message || "Request failed");
      toast.success(mode === "edit" ? "Sub admin updated" : "Sub admin created");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !saving && onClose()} />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === "edit" ? "Edit Sub Admin" : "Add Sub Admin"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Name"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email *</label>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Email"
                type="email"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Mobile *</label>
              <input
                value={form.mobile}
                onChange={(e) => update("mobile", e.target.value)}
                placeholder="Mobile"
                inputMode="numeric"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password{mode === "add" ? " *" : ""}
                </label>
                {mode === "edit" && (
                  <span className="text-xs text-gray-500">Leave blank to keep current</span>
                )}
              </div>
              <input
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder={mode === "edit" ? "New password (optional)" : "Password"}
                type="password"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <label className="inline-flex items-center gap-2 pt-1 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">Permission pages</p>
                <p className="text-xs text-gray-500">
                  Choose which sidebar pages this sub admin can access
                </p>
              </div>

              <label className="shrink-0 inline-flex items-center gap-2 whitespace-nowrap select-none cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-blue-600 hover:text-blue-700">
                  Select all
                </span>
              </label>
            </div>

            <div className="border rounded-xl p-4 max-h-[260px] overflow-auto bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissionOptions.map((p) => (
                  <label key={p.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.has(p.key)}
                      onChange={() => togglePermission(p.key)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-800">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-1 text-xs text-gray-500">
              Selected: {form.permissions.length}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Sub Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubAdminsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [viewPermsOpen, setViewPermsOpen] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState({ name: "", permissions: [] });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const load = async ({ nextPage = page, nextSearch = search } = {}) => {
    try {
      setLoading(true);
      const params = {
        page: nextPage,
        limit,
        ...(nextSearch?.trim() ? { search: nextSearch.trim() } : {}),
      };
      const res = await subAdminsAPI.getSubAdmins(params);
      const data = apiHelper.handleResponse(res);

      setItems(Array.isArray(data?.subAdmins) ? data.subAdmins : []);
      setPagination((prev) => ({
        ...prev,
        ...(data?.pagination || {}),
      }));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Cannot reach the API server. Make sure the backend is running on port 5000."
          : err?.message) ||
        "Failed to load sub admins";
      toast.error(message);
      setItems([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load({ nextPage: 1, nextSearch: search });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this sub admin?")) return;
    try {
      await subAdminsAPI.deleteSubAdmin(id);
      toast.success("Deleted");
      load({ nextPage: page, nextSearch: search });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sub Admins</h1>
            <p className="text-sm text-gray-500 mt-1">Manage sub admins and page permissions</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Sub Admin
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sub admins..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-500 sm:ml-auto">
            Total: <span className="font-medium text-gray-700">{pagination.total ?? items.length}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-10 ml-auto" /></td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No sub admins found.
                    </td>
                  </tr>
                ) : (
                  items.map((sa) => {
                    const perms = normalizePermissions(sa.permissions || sa.permissionPages || sa.pages);
                    const active = sa.isActive !== false;
                    return (
                      <tr key={sa._id || sa.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sa.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {sa.email || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {sa.mobile || sa.phone || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPerms({ name: sa.name || "", permissions: perms });
                              setViewPermsOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            title="View permissions"
                          >
                            {perms.length}
                            <span className="text-xs text-gray-400">(view)</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditRow(sa);
                              setEditOpen(true);
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-1"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sa._id || sa.id)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-50"
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
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-white">
              <div className="text-sm text-gray-600">
                Page <span className="font-medium">{pagination.currentPage}</span> of{" "}
                <span className="font-medium">{pagination.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SubAdminModal
        open={open}
        mode="add"
        initialData={null}
        onClose={() => setOpen(false)}
        onSaved={() => load({ nextPage: page, nextSearch: search })}
      />
      <SubAdminModal
        open={editOpen}
        mode="edit"
        initialData={editRow}
        onClose={() => {
          setEditOpen(false);
          setEditRow(null);
        }}
        onSaved={() => load({ nextPage: page, nextSearch: search })}
      />
      <ViewPermissionsModal
        open={viewPermsOpen}
        onClose={() => setViewPermsOpen(false)}
        name={selectedPerms.name}
        permissionKeys={selectedPerms.permissions}
      />
    </Layout>
  );
}

