import { ID, Query, type Models } from "appwrite";
import { databases, DATABASE_ID } from "@/services/appwrite/client";
import type { CollectionId } from "@/constants/collections";

export interface ListDocumentsOptions {
  queries?: string[];
  page?: number;
  pageSize?: number;
  search?: string;
  searchAttributes?: string[];
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  includeDeleted?: boolean;
}

export interface PaginatedDocuments<T> {
  documents: T[];
  total: number;
}

function buildQueries(options: ListDocumentsOptions = {}) {
  const queries = [...(options.queries ?? [])];
  const pageSize = options.pageSize ?? 25;
  const offset = ((options.page ?? 1) - 1) * pageSize;

  queries.push(Query.limit(pageSize));
  queries.push(Query.offset(offset));

  if (!options.includeDeleted) {
    queries.push(Query.notEqual("isDeleted", true));
  }

  if (options.search && options.searchAttributes?.length) {
    const value = options.search.trim();
    if (value) {
      for (const attribute of options.searchAttributes) {
        queries.push(Query.search(attribute, value));
      }
    }
  }

  if (options.sortBy) {
    queries.push(
      options.sortDirection === "asc" ? Query.orderAsc(options.sortBy) : Query.orderDesc(options.sortBy),
    );
  } else {
    queries.push(Query.orderDesc("$updatedAt"));
  }

  return queries;
}

/**
 * Generic repository over a single Appwrite collection.
 * Usage: const servicesRepo = createRepository<Service>(COLLECTIONS.SERVICES);
 */
export function createRepository<T extends { $id: string }>(collectionId: CollectionId) {
  return {
    async list(queries: string[] = []) {
      const res = await databases.listDocuments(DATABASE_ID, collectionId, queries);
      return res.documents as unknown as T[];
    },

    async listPaginated(options: ListDocumentsOptions = {}): Promise<PaginatedDocuments<T>> {
      const res = await databases.listDocuments(DATABASE_ID, collectionId, buildQueries(options));
      return {
        documents: res.documents as unknown as T[],
        total: res.total,
      };
    },

    async count(queries: string[] = []) {
      const res = await databases.listDocuments(DATABASE_ID, collectionId, [
        ...queries,
        Query.limit(1),
      ]);
      return res.total;
    },

    async getById(id: string) {
      const doc = await databases.getDocument(DATABASE_ID, collectionId, id);
      return doc as unknown as T;
    },

    async getBySlug(slug: string) {
      const res = await databases.listDocuments(DATABASE_ID, collectionId, [
        Query.equal("slug", slug),
        Query.limit(1),
      ]);
      return (res.documents[0] as unknown as T) ?? null;
    },

    async create(data: Omit<T, "$id" | "$createdAt" | "$updatedAt">, id: string = ID.unique()) {
      const doc = await databases.createDocument(DATABASE_ID, collectionId, id, data);
      return doc as unknown as T;
    },

    async update(id: string, data: Partial<T>) {
      const doc = await databases.updateDocument(DATABASE_ID, collectionId, id, data);
      return doc as unknown as T;
    },

    async remove(id: string) {
      await databases.deleteDocument(DATABASE_ID, collectionId, id);
    },

    async softDelete(id: string) {
      const doc = await databases.updateDocument(DATABASE_ID, collectionId, id, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      });
      return doc as unknown as T;
    },

    async restore(id: string) {
      const doc = await databases.updateDocument(DATABASE_ID, collectionId, id, {
        isDeleted: false,
        deletedAt: null,
      });
      return doc as unknown as T;
    },

    async bulkUpdate(ids: string[], data: Partial<T>) {
      const updates = await Promise.all(
        ids.map((id) => databases.updateDocument(DATABASE_ID, collectionId, id, data)),
      );
      return updates as unknown as T[];
    },

    async bulkSoftDelete(ids: string[]) {
      await Promise.all(
        ids.map((id) =>
          databases.updateDocument(DATABASE_ID, collectionId, id, {
            isDeleted: true,
            deletedAt: new Date().toISOString(),
          }),
        ),
      );
    },

    async rawList(queries: string[] = []) {
      return databases.listDocuments(DATABASE_ID, collectionId, queries) as Promise<Models.DocumentList<Models.Document>>;
    },
  };
}
