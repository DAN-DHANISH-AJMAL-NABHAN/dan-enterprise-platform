import { ID, Query } from "appwrite";
import { databases, DATABASE_ID } from "@/services/appwrite/client";
import type { CollectionId } from "@/constants/collections";

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
  };
}
