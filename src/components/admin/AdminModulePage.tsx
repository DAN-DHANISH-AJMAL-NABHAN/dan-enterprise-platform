import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Query } from "appwrite";
import { motion } from "framer-motion";
import {
  ArchiveRestore,
  Check,
  Download,
  Edit3,
  FileSpreadsheet,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { AdminField, AdminModuleConfig } from "@/modules/admin/adminModules";
import { createRepository } from "@/services/appwrite/repository";
import { mediaService } from "@/services/appwrite/media.service";
import {
  buildZodSchema,
  downloadCsv,
  fieldDefault,
  formatAdminValue,
  humanizeKey,
  normalizeFormPayload,
  normalizeRecordForForm,
  slugify,
  type AdminRecord,
} from "@/utils/admin";
import { cn } from "@/utils/cn";

interface AdminModulePageProps {
  module: AdminModuleConfig;
}

type SortDirection = "asc" | "desc";

export function AdminModulePage({ module }: AdminModulePageProps) {
  const queryClient = useQueryClient();
  const repository = useMemo(() => createRepository<AdminRecord>(module.collectionId), [module.collectionId]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [sortBy, setSortBy] = useState("$updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const queries = useMemo(() => {
    const filters: string[] = [];
    if (module.statusField && status !== "all") filters.push(Query.equal(module.statusField, status));
    return filters;
  }, [module.statusField, status]);

  const listQuery = useQuery({
    queryKey: ["admin-module", module.id, page, pageSize, search, status, includeDeleted, sortBy, sortDirection],
    queryFn: () =>
      repository.listPaginated({
        page,
        pageSize,
        search,
        searchAttributes: module.searchFields,
        includeDeleted,
        sortBy,
        sortDirection,
        queries,
      }),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-module", module.id] });
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => repository.bulkSoftDelete(ids),
    onSuccess: async () => {
      setSelectedIds([]);
      await invalidate();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => repository.restore(id),
    onSuccess: invalidate,
  });

  const statusMutation = useMutation({
    mutationFn: ({ ids, value }: { ids: string[]; value: string }) =>
      repository.bulkUpdate(ids, { [module.statusField ?? "status"]: value }),
    onSuccess: async () => {
      setSelectedIds([]);
      await invalidate();
    },
  });

  const documents = listQuery.data?.documents ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const statusOptions = module.fields.find((field) => field.name === module.statusField)?.options ?? [];

  const openCreate = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const openEdit = (record: AdminRecord) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const toggleSort = (column: string) => {
    setSortBy(column);
    setSortDirection((current) => (sortBy === column && current === "asc" ? "desc" : "asc"));
  };

  return (
    <section className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <module.icon size={20} />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold">{module.title}</h2>
                <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => listQuery.refetch()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => downloadCsv(`${module.id}.csv`, documents, module.tableColumns)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
            >
              <Download size={16} /> CSV
            </button>
            <button
              type="button"
              onClick={() => downloadCsv(`${module.id}.xls`, documents, module.tableColumns)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            {!module.readOnly && (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm"
              >
                <Plus size={16} /> New {module.singular}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={`Search ${module.title.toLowerCase()}`}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-white/5"
            />
          </label>
          {module.statusField && (
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-950"
            >
              <option value="all">All status</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {humanizeKey(option)}
                </option>
              ))}
            </select>
          )}
          <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm dark:border-white/10">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(event) => setIncludeDeleted(event.target.checked)}
            />
            Include deleted
          </label>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-950"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
            <span className="font-medium">{selectedIds.length} selected</span>
            {module.statusField &&
              statusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => statusMutation.mutate({ ids: selectedIds, value: option })}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs hover:bg-white dark:border-white/10 dark:hover:bg-white/10"
                >
                  <Check size={14} /> {humanizeKey(option)}
                </button>
              ))}
            <button
              type="button"
              onClick={() => deleteMutation.mutate(selectedIds)}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2 text-xs text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
            >
              <Trash2 size={14} /> Bulk delete
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={documents.length > 0 && selectedIds.length === documents.length}
                    onChange={(event) =>
                      setSelectedIds(event.target.checked ? documents.map((record) => record.$id) : [])
                    }
                  />
                </th>
                {module.tableColumns.map((column) => (
                  <th key={column} className="px-4 py-3">
                    <button type="button" onClick={() => toggleSort(column)} className="font-semibold">
                      {humanizeKey(column)}
                      {sortBy === column ? ` ${sortDirection === "asc" ? "↑" : "↓"}` : ""}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {listQuery.isLoading &&
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={module.tableColumns.length + 2} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-slate-100 dark:bg-white/10" />
                    </td>
                  </tr>
                ))}
              {!listQuery.isLoading &&
                documents.map((record) => {
                  const isDeleted = Boolean(record.isDeleted);
                  return (
                    <tr key={record.$id} className={cn(isDeleted && "bg-red-50/60 text-slate-400 dark:bg-red-500/10")}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(record.$id)}
                          onChange={(event) =>
                            setSelectedIds((ids) =>
                              event.target.checked
                                ? [...ids, record.$id]
                                : ids.filter((id) => id !== record.$id),
                            )
                          }
                        />
                      </td>
                      {module.tableColumns.map((column) => (
                        <td key={column} className="max-w-[260px] truncate px-4 py-3">
                          {column === module.statusField ? (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                              {formatAdminValue(record[column])}
                            </span>
                          ) : (
                            formatAdminValue(record[column])
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {!module.readOnly && !isDeleted && (
                            <button
                              type="button"
                              onClick={() => openEdit(record)}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
                              aria-label="Edit"
                            >
                              <Edit3 size={15} />
                            </button>
                          )}
                          {isDeleted ? (
                            <button
                              type="button"
                              onClick={() => restoreMutation.mutate(record.$id)}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10"
                              aria-label="Restore"
                            >
                              <ArchiveRestore size={15} />
                            </button>
                          ) : (
                            !module.readOnly && (
                              <button
                                type="button"
                                onClick={() => deleteMutation.mutate([record.$id])}
                                className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                                aria-label="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {!listQuery.isLoading && documents.length === 0 && (
                <tr>
                  <td colSpan={module.tableColumns.length + 2} className="px-4 py-12 text-center">
                    <p className="font-medium">No records found</p>
                    <p className="mt-1 text-sm text-slate-500">Create content or adjust your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500 dark:text-slate-400">
            Showing {documents.length} of {total} records
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="h-9 rounded-lg border border-slate-200 px-3 disabled:opacity-40 dark:border-white/10"
            >
              Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="h-9 rounded-lg border border-slate-200 px-3 disabled:opacity-40 dark:border-white/10"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
        <AdminRecordDialog
          module={module}
          repository={repository}
          record={editingRecord}
          onClose={() => setFormOpen(false)}
          onSaved={async () => {
            setFormOpen(false);
            await invalidate();
          }}
        />
      )}
    </section>
  );
}

interface AdminRecordDialogProps {
  module: AdminModuleConfig;
  repository: ReturnType<typeof createRepository<AdminRecord>>;
  record: AdminRecord | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function AdminRecordDialog({ module, repository, record, onClose, onSaved }: AdminRecordDialogProps) {
  const schema = useMemo(() => buildZodSchema(module.fields), [module.fields]);
  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues: normalizeRecordForForm(module.fields, record),
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = normalizeFormPayload(module.fields, values);
      if ("slug" in payload && !payload.slug) {
        payload.slug = slugify(String(payload[module.primaryField] ?? module.singular));
      }
      if (record) return repository.update(record.$id, payload);
      return repository.create({
        ...payload,
        isDeleted: false,
      } as Omit<AdminRecord, "$id" | "$createdAt" | "$updatedAt">);
    },
    onSuccess: onSaved,
  });

  const sections = useMemo(() => {
    return module.fields.reduce<Record<string, AdminField[]>>((grouped, field) => {
      const section = field.section ?? "Content";
      grouped[section] = [...(grouped[section] ?? []), field];
      return grouped;
    }, {});
  }, [module.fields]);

  async function uploadForField(field: AdminField, file: File) {
    setUploadingField(field.name);
    try {
      const uploaded = await mediaService.upload(file);
      form.setValue(field.name, uploaded.$id, { shouldDirty: true, shouldValidate: true });
      if (form.getValues("fileName") === fieldDefault({ ...field, name: "fileName", label: "File Name", type: "text" })) {
        form.setValue("fileName", file.name, { shouldDirty: true });
      }
      if (form.getValues("fileType") === "") {
        form.setValue("fileType", file.type.startsWith("image/") ? "image" : file.type.includes("pdf") ? "pdf" : "document");
      }
    } finally {
      setUploadingField(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-white/10">
          <div>
            <h3 className="font-display text-xl font-semibold">
              {record ? "Edit" : "Create"} {module.singular}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))} className="max-h-[calc(92vh-88px)] overflow-y-auto">
          <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              {Object.entries(sections)
                .filter(([section]) => !["Publishing", "SEO"].includes(section))
                .map(([section, fields]) => (
                  <fieldset key={section} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                    <legend className="px-2 text-sm font-semibold">{section}</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {fields.map((field) => (
                        <AdminFieldControl
                          key={field.name}
                          field={field}
                          form={form}
                          uploading={uploadingField === field.name}
                          onUpload={uploadForField}
                        />
                      ))}
                    </div>
                  </fieldset>
                ))}
            </div>

            <div className="space-y-5">
              {["Publishing", "SEO"].map((section) =>
                sections[section] ? (
                  <fieldset key={section} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                    <legend className="px-2 text-sm font-semibold">{section}</legend>
                    <div className="space-y-4">
                      {sections[section].map((field) => (
                        <AdminFieldControl
                          key={field.name}
                          field={field}
                          form={form}
                          uploading={uploadingField === field.name}
                          onUpload={uploadForField}
                        />
                      ))}
                    </div>
                  </fieldset>
                ) : null,
              )}
            </div>
          </div>

          {saveMutation.error && (
            <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {saveMutation.error instanceof Error ? saveMutation.error.message : "Unable to save record."}
            </div>
          )}

          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saveMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              Save {module.singular}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface AdminFieldControlProps {
  field: AdminField;
  form: ReturnType<typeof useForm<Record<string, unknown>>>;
  uploading: boolean;
  onUpload: (field: AdminField, file: File) => Promise<void>;
}

function AdminFieldControl({ field, form, uploading, onUpload }: AdminFieldControlProps) {
  const error = form.formState.errors[field.name]?.message;
  const commonClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary dark:border-white/10 dark:bg-slate-950";
  const registered = form.register(field.name);
  const wide = ["textarea", "richtext", "json", "tags", "file", "image"].includes(field.type);

  return (
    <label className={cn("block space-y-1", wide && "sm:col-span-2")}>
      <span className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </span>

      {field.type === "textarea" || field.type === "richtext" || field.type === "json" ? (
        <textarea
          {...registered}
          rows={field.type === "richtext" ? 8 : field.type === "json" ? 7 : 4}
          placeholder={field.placeholder}
          className={cn(commonClass, "min-h-28 py-2")}
        />
      ) : field.type === "select" ? (
        <select {...registered} className={cn(commonClass, "h-10")}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {humanizeKey(option)}
            </option>
          ))}
        </select>
      ) : field.type === "boolean" ? (
        <span className="flex h-10 items-center">
          <input type="checkbox" {...registered} className="h-4 w-4 rounded border-slate-300" />
        </span>
      ) : field.type === "image" || field.type === "file" ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-3 dark:border-white/15">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input {...registered} className={cn(commonClass, "h-10 flex-1")} placeholder="Storage file ID" />
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload
              <input
                type="file"
                className="hidden"
                accept={field.type === "image" ? "image/*" : undefined}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onUpload(field, file);
                }}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">Uploaded files are stored in Appwrite Storage and saved as file IDs.</p>
        </div>
      ) : (
        <input
          {...registered}
          type={field.type === "number" || field.type === "currency" ? "number" : field.type}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          className={cn(commonClass, "h-10")}
        />
      )}

      {error && <span className="text-xs text-red-600">{String(error)}</span>}
    </label>
  );
}
