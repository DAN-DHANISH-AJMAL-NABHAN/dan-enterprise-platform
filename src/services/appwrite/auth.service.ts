import { ID } from "appwrite";
import { account } from "@/services/appwrite/client";
import { isAdminIdentity } from "@/config/env";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

export type OtpChannel = "email" | "phone";

export interface OtpChallenge {
  userId: string;
  channel: OtpChannel;
  identity: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose E.164-ish check: leading + and 8-15 digits. Appwrite requires E.164 phone numbers.
const PHONE_RE = /^\+[1-9]\d{7,14}$/;

function detectChannel(identifier: string): OtpChannel {
  const value = identifier.trim();
  if (EMAIL_RE.test(value)) return "email";
  if (PHONE_RE.test(value)) return "phone";
  throw new Error(
    "Enter a valid email address, or a phone number in international format (e.g. +14155551234).",
  );
}

async function toCurrentUser(): Promise<CurrentUser> {
  const user = await account.get();
  return {
    id: user.$id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: isAdminIdentity(user.email, user.phone),
  };
}

export const authService = {
  async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      return await toCurrentUser();
    } catch {
      return null;
    }
  },

  async requestOtp(identifierRaw: string): Promise<OtpChallenge> {
    const identifier = identifierRaw.trim();
    const channel = detectChannel(identifier);

    const normalized = channel === "email" ? identifier.toLowerCase() : identifier;
    const authorized =
      channel === "email"
        ? isAdminIdentity(normalized, undefined)
        : isAdminIdentity(undefined, normalized.toLowerCase());

    if (!authorized) {
      throw new Error("This email or phone number is not authorized for admin access.");
    }

    const userId = ID.unique();

    if (channel === "email") {
      const token = await account.createEmailToken(userId, normalized);
      return { userId: token.userId, channel, identity: normalized };
    }

    const token = await account.createPhoneToken(userId, normalized);
    return { userId: token.userId, channel, identity: normalized };
  },

  async verifyOtp(userId: string, secret: string): Promise<CurrentUser> {
    await account.createSession(userId, secret);
    const user = await toCurrentUser();
    if (!user.isAdmin) {
      await authService.logout();
      throw new Error("This account is not authorized for admin access.");
    }
    return user;
  },

  async logout(): Promise<void> {
    await account.deleteSession("current");
  },
};