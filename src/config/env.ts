/**
 * Central, typed access point for environment variables.
 * Import this instead of reading import.meta.env directly elsewhere,
 * so missing config fails fast and in one place.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env file against .env.example.`,
    );
  }
  return value;
}

function csv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

export const env = {
  appwrite: {
    endpoint: required(
      "VITE_APPWRITE_ENDPOINT",
      import.meta.env.VITE_APPWRITE_ENDPOINT,
    ),
    projectId: required(
      "VITE_APPWRITE_PROJECT_ID",
      import.meta.env.VITE_APPWRITE_PROJECT_ID,
    ),
    databaseId: required(
      "VITE_APPWRITE_DATABASE_ID",
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
    ),
    mediaBucketId: import.meta.env.VITE_APPWRITE_MEDIA_BUCKET_ID ?? "",
  },
  admin: {
    emails: csv(import.meta.env.VITE_ADMIN_EMAILS),
    phones: csv(import.meta.env.VITE_ADMIN_PHONES),
  },
};

export function isAdminIdentity(email?: string | null, phone?: string | null): boolean {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phone?.trim().toLowerCase();
  return (
    (!!normalizedEmail && env.admin.emails.includes(normalizedEmail)) ||
    (!!normalizedPhone && env.admin.phones.includes(normalizedPhone))
  );
}
