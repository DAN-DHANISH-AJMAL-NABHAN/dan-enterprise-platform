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

  async loginWithEmail(email: string, password: string): Promise<CurrentUser> {
    await account.createEmailPasswordSession(email, password);
    return toCurrentUser();
  },

  async registerWithEmail(email: string, password: string, name: string): Promise<CurrentUser> {
    await account.create(ID.unique(), email, password, name);
    return authService.loginWithEmail(email, password);
  },

  async logout(): Promise<void> {
    await account.deleteSession("current");
  },
};
