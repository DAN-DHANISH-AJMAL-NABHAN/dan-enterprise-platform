import { z } from "zod";
import type { AdminField } from "@/modules/admin/adminModules";

export type AdminRecord = Record<string, unknown> & {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
};

export function humanizeKey(key: string) {
  if (key.startsWith("$")) return key.replace("$", "").replace("At", " at");
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatAdminValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }
  return String(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fieldDefault(field: AdminField) {
  if (field.type === "boolean") return false;
  if (field.type === "number" || field.type === "currency") return "";
  if (field.type === "tags" || field.type === "multiselect") return [];
  if (field.type === "select") return field.options?.[0] ?? "";
  if (field.type === "json") return "{}";
  return "";
}

export function normalizeRecordForForm(fields: AdminField[], record?: AdminRecord | null) {
  return fields.reduce<Record<string, unknown>>((values, field) => {
    const value = record?.[field.name];
    if (field.type === "json") {
      values[field.name] =
        typeof value === "string"
          ? value
          : value
            ? JSON.stringify(value, null, 2)
            : fieldDefault(field);
      return values;
    }
    if (field.type === "tags" || field.type === "multiselect") {
      values[field.name] = Array.isArray(value) ? value.join(", ") : value ?? "";
      return values;
    }
    values[field.name] = value ?? fieldDefault(field);
    return values;
  }, {});
}

export function normalizeFormPayload(fields: AdminField[], values: Record<string, unknown>) {
  return fields.reduce<Record<string, unknown>>((payload, field) => {
    const value = values[field.name];
    if (field.type === "number" || field.type === "currency") {
      payload[field.name] = value === "" || value === undefined ? null : Number(value);
      return payload;
    }
    if (field.type === "boolean") {
      payload[field.name] = Boolean(value);
      return payload;
    }
    if (field.type === "tags" || field.type === "multiselect") {
      payload[field.name] =
        typeof value === "string"
          ? value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(value)
            ? value
            : [];
      return payload;
    }
    if (field.type === "json") {
      payload[field.name] = typeof value === "string" ? value : JSON.stringify(value ?? {});
      return payload;
    }
    payload[field.name] = value ?? "";
    return payload;
  }, {});
}

export function buildZodSchema(fields: AdminField[]) {
  const shape = fields.reduce<Record<string, z.ZodTypeAny>>((schema, field) => {
    let validator: z.ZodTypeAny;
    if (field.type === "email") {
      validator = z.string().email("Enter a valid email address");
    } else if (field.type === "url") {
      validator = z.string().url("Enter a valid URL").or(z.literal(""));
    } else if (field.type === "number" || field.type === "currency") {
      validator = z.coerce.number().finite().or(z.literal(""));
      if (field.min !== undefined) validator = z.coerce.number().min(field.min).or(z.literal(""));
      if (field.max !== undefined) validator = z.coerce.number().max(field.max).or(z.literal(""));
    } else if (field.type === "boolean") {
      validator = z.boolean().optional();
    } else if (field.type === "json") {
      validator = z.string().refine(
        (value) => {
          try {
            JSON.parse(value || "{}");
            return true;
          } catch {
            return false;
          }
        },
        { message: "Enter valid JSON" },
      );
    } else {
      validator = z.string();
    }

    schema[field.name] = field.required
      ? validator.refine((value) => value !== "" && value !== undefined && value !== null, {
          message: `${field.label} is required`,
        })
      : validator.optional();
    return schema;
  }, {});

  return z.object(shape);
}

export function downloadCsv(fileName: string, rows: AdminRecord[], columns: string[]) {
  const escape = (value: unknown) => `"${formatAdminValue(value).replace(/"/g, '""')}"`;
  const content = [
    columns.map(escape).join(","),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(",")),
  ].join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
