import { Client, Account, Databases, Storage, Functions, Teams } from "appwrite";
import { env } from "@/config/env";

export const client = new Client()
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const teams = new Teams(client);

export const DATABASE_ID = env.appwrite.databaseId;
